param(
  [int]$Port = 8081,
  [string]$DefaultGasUrl = ""
)

$ErrorActionPreference = "Stop"
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$RootDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$SpreadsheetId = "1zmq-qaZW5EGiWWGAJ1a1zhgGch11AhdMRUI7lI7wRJg"
$SubmissionsFile = Join-Path $RootDir "submissions_log.json"

function Invoke-GasPost([string]$Url, [string]$JsonBody) {
  $BodyBytes = [System.Text.Encoding]::UTF8.GetBytes($JsonBody)
  $Req = [System.Net.HttpWebRequest]::Create($Url)
  $Req.Method = "POST"
  $Req.ContentType = "text/plain; charset=utf-8"
  $Req.AllowAutoRedirect = $false
  $Req.ContentLength = $BodyBytes.Length

  $ReqStream = $Req.GetRequestStream()
  $ReqStream.Write($BodyBytes, 0, $BodyBytes.Length)
  $ReqStream.Close()

  try {
    $HttpResp = [System.Net.HttpWebResponse]$Req.GetResponse()
  } catch [System.Net.WebException] {
    if ($_.Exception.Response) {
      $HttpResp = [System.Net.HttpWebResponse]$_.Exception.Response
    } else {
      throw
    }
  }

  $StatusCode = [int]$HttpResp.StatusCode
  if ($StatusCode -ge 300 -and $StatusCode -lt 400) {
    $RedirectUrl = $HttpResp.Headers["Location"]
    $HttpResp.Close()
    $GetReq = [System.Net.HttpWebRequest]::Create($RedirectUrl)
    $GetReq.Method = "GET"
    $GetReq.AllowAutoRedirect = $true
    $FinalResp = [System.Net.HttpWebResponse]$GetReq.GetResponse()
    $Reader = New-Object System.IO.StreamReader($FinalResp.GetResponseStream(), [System.Text.Encoding]::UTF8)
    $Content = $Reader.ReadToEnd()
    $Reader.Close()
    $FinalResp.Close()
    return $Content
  } else {
    $Reader = New-Object System.IO.StreamReader($HttpResp.GetResponseStream(), [System.Text.Encoding]::UTF8)
    $Content = $Reader.ReadToEnd()
    $Reader.Close()
    $HttpResp.Close()
    return $Content
  }
}

$Listener = New-Object System.Net.HttpListener
$Listener.Prefixes.Add("http://localhost:$Port/")
$Listener.Start()

Write-Host "====================================================="
Write-Host " Pelayan Borang Digital WEHU-D1/D2 aktif di:"
Write-Host " http://localhost:$Port"
Write-Host "====================================================="

$MimeTypes = @{
  ".html" = "text/html; charset=utf-8"
  ".css"  = "text/css; charset=utf-8"
  ".js"   = "application/javascript; charset=utf-8"
  ".json" = "application/json; charset=utf-8"
  ".pdf"  = "application/pdf"
  ".svg"  = "image/svg+xml"
  ".png"  = "image/png"
}

try {
  while ($Listener.IsListening) {
    $Context = $Listener.GetContext()
    $Request = $Context.Request
    $Response = $Context.Response

    $UrlPath = $Request.Url.AbsolutePath
    if ($UrlPath -eq "/") { $UrlPath = "/index.html" }

    try {
      if ($Request.HttpMethod -eq "POST" -and $UrlPath -eq "/api/submit") {
        $Reader = New-Object System.IO.StreamReader($Request.InputStream, [System.Text.Encoding]::UTF8)
        $BodyText = $Reader.ReadToEnd()
        $Reader.Close()

        $Payload = $BodyText | ConvertFrom-Json
        $RowArray = @($Payload.row)
        $ActiveGasUrl = if ($Payload.gasUrl) { [string]$Payload.gasUrl } else { $DefaultGasUrl }

        if ($ActiveGasUrl) {
          $ForwardJson = @{ row = $RowArray } | ConvertTo-Json -Depth 5
          $GasResponseText = Invoke-GasPost -Url $ActiveGasUrl -JsonBody $ForwardJson
          $GasResult = $GasResponseText | ConvertFrom-Json
          if (-not $GasResult.ok) {
            throw "Google Apps Script error: $($GasResult.error)"
          }
          $RowArray[0] = "$($GasResult.rowNumber)"
        } else {
          $ExistingLog = @()
          if (Test-Path $SubmissionsFile) {
            $RawLog = Get-Content $SubmissionsFile -Raw -Encoding UTF8
            if ($RawLog.Trim()) {
              $Parsed = $RawLog | ConvertFrom-Json
              if ($Parsed -is [System.Array]) { $ExistingLog = $Parsed } else { $ExistingLog = @($Parsed) }
            }
          }
          $NextNo = $ExistingLog.Count + 1
          $RowArray[0] = "$NextNo"
          $ExistingLog += ,$RowArray
          ($ExistingLog | ConvertTo-Json -Depth 5) | Set-Content -Path $SubmissionsFile -Encoding UTF8

          $GasResponseText = @{
            ok = $true
            rowNumber = $NextNo
            note = "Saved locally; deploy Code.gs and set Apps Script URL for direct cloud sync."
          } | ConvertTo-Json
        }

        $Buffer = [System.Text.Encoding]::UTF8.GetBytes($GasResponseText)
        $Response.StatusCode = 200
        $Response.ContentType = "application/json; charset=utf-8"
        $Response.ContentLength64 = $Buffer.Length
        $Response.OutputStream.Write($Buffer, 0, $Buffer.Length)
        $Response.OutputStream.Close()
        continue
      }

      $SafeRelPath = $UrlPath.TrimStart("/").Replace("/", "\")
      $FilePath = Join-Path $RootDir $SafeRelPath

      if (Test-Path $FilePath -PathType Leaf) {
        $Ext = [System.IO.Path]::GetExtension($FilePath).ToLower()
        $ContentType = if ($MimeTypes.ContainsKey($Ext)) { $MimeTypes[$Ext] } else { "application/octet-stream" }
        $Bytes = [System.IO.File]::ReadAllBytes($FilePath)

        $Response.StatusCode = 200
        $Response.ContentType = $ContentType
        $Response.ContentLength64 = $Bytes.Length
        $Response.OutputStream.Write($Bytes, 0, $Bytes.Length)
      } else {
        $NotFoundBytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
        $Response.StatusCode = 404
        $Response.ContentType = "text/plain; charset=utf-8"
        $Response.ContentLength64 = $NotFoundBytes.Length
        $Response.OutputStream.Write($NotFoundBytes, 0, $NotFoundBytes.Length)
      }
    } catch {
      $ErrJson = @{ ok = $false; error = $_.Exception.Message } | ConvertTo-Json
      $ErrBytes = [System.Text.Encoding]::UTF8.GetBytes($ErrJson)
      $Response.StatusCode = 500
      $Response.ContentType = "application/json; charset=utf-8"
      $Response.ContentLength64 = $ErrBytes.Length
      $Response.OutputStream.Write($ErrBytes, 0, $ErrBytes.Length)
    } finally {
      $Response.OutputStream.Close()
    }
  }
} finally {
  $Listener.Stop()
}
