/**
 * Google Apps Script (Code.gs) untuk Google Sheet WEHU_D
 * Spreadsheet ID: 1zmq-qaZW5EGiWWGAJ1a1zhgGch11AhdMRUI7lI7wRJg
 * Format: 63 Lajur Data (A:BK) + Lajur ke-64 Rekod_Link (BL - Formula Automatik)
 *
 * PENTING:
 * 1. Klik butang 'Run' (fungsi authorizeScript) sekali untuk beri kebenaran (Allow).
 * 2. Klik 'Deploy' > 'New deployment' > Pilih jenis 'Web app':
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 3. Salin 'Web app URL' (berakhir dengan /exec) dan masukkan ke dalam borang / kongsikan.
 */

const SPREADSHEET_ID = "1zmq-qaZW5EGiWWGAJ1a1zhgGch11AhdMRUI7lI7wRJg";
const SHEET_NAME = "WEHU_D";

// Fungsi pertama untuk dijalankan apabila klik butang 'Run' di editor Apps Script
function authorizeScript() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  Logger.log("Kebenaran berjaya disahkan untuk Google Sheet: " + ss.getName());
}

function getDataColumnCount(sheet) {
  const lastCol = sheet.getLastColumn();
  if (lastCol < 1) return 63;
  const headers = sheet.getRange(1, 1, 1, lastCol).getDisplayValues()[0];
  const rekodIdx = headers.findIndex(function (h) {
    return String(h || "").trim().toLowerCase() === "rekod_link";
  });
  return rekodIdx > 0 ? rekodIdx : 63;
}

function normalizeIc(val) {
  return String(val || "").replace(/^'/, "").trim().toUpperCase();
}

function normalizeDateStr(val, tz) {
  if (!val) return "";
  if (Object.prototype.toString.call(val) === "[object Date]" && !isNaN(val.getTime())) {
    return Utilities.formatDate(val, tz || "Asia/Kuala_Lumpur", "dd/MM/yyyy");
  }
  return String(val).trim();
}

function doGet(e) {
  try {
    const params = (e && e.parameter) || {};
    const targetIc = normalizeIc(params.ic || "");
    const targetDate = String(params.date || "").trim();
    const targetNo = String(params.no || "").trim();

    if (!targetIc && !targetNo) {
      return ContentService.createTextOutput(
        JSON.stringify({ ok: true, message: "Web App WEHU_D aktif dan sedia menerima data." })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const tz = ss.getSpreadsheetTimeZone() || "Asia/Kuala_Lumpur";
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
    const dataCols = getDataColumnCount(sheet);

    const colA = sheet.getRange("A:A").getDisplayValues();
    let lastDataRow = 1;
    for (let i = colA.length - 1; i >= 0; i--) {
      if (String(colA[i][0] || "").trim() !== "") {
        lastDataRow = i + 1;
        break;
      }
    }

    if (lastDataRow < 2) {
      return ContentService.createTextOutput(
        JSON.stringify({ ok: false, error: "Tiada rekod dalam Google Sheet WEHU_D." })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    const displayValues = sheet.getRange(2, 1, lastDataRow - 1, dataCols).getDisplayValues();
    let matchedRow = null;
    let matchedSheetRow = -1;

    for (let i = displayValues.length - 1; i >= 0; i--) {
      const r = displayValues[i];
      const rowNo = String(r[0] || "").trim();
      const rowDate = normalizeDateStr(r[1], tz);
      const rowIc = normalizeIc(r[11]);

      const icMatch = !targetIc || rowIc === targetIc || rowIc.indexOf(targetIc) === 0;
      const dateMatch = !targetDate || rowDate === targetDate;
      const noMatch = !targetNo || rowNo === targetNo;

      if (icMatch && dateMatch && noMatch) {
        matchedRow = r;
        matchedSheetRow = i + 2;
        break;
      }
    }

    if (!matchedRow) {
      return ContentService.createTextOutput(
        JSON.stringify({ ok: false, error: "Rekod tidak dijumpai bagi IC dan Tarikh tersebut." })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(
      JSON.stringify({
        ok: true,
        rowNumber: matchedRow[0],
        sheetRowIndex: matchedSheetRow,
        row: matchedRow
      })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: err.message })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error("Tiada data POST diterima. Pastikan skrip ini diterbitkan melalui Deploy > New deployment > Web app.");
    }
    const payload = JSON.parse(e.postData.contents);
    if (!Array.isArray(payload.row)) {
      throw new Error("Format data tidak sah.");
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
    const dataCols = getDataColumnCount(sheet);

    const row = payload.row.slice(0, dataCols);
    while (row.length < dataCols) {
      row.push("");
    }

    const colA = sheet.getRange("A:A").getDisplayValues();
    let lastDataRow = 1;
    for (let i = colA.length - 1; i >= 0; i--) {
      if (String(colA[i][0] || "").trim() !== "") {
        lastDataRow = i + 1;
        break;
      }
    }

    const nextNo = lastDataRow >= 1 ? lastDataRow : 1;
    row[0] = nextNo;

    // Auto-stamp DATE OF ENTRY (dd/mm/yyyy) in Column B (index 1) upon submission
    const tz = ss.getSpreadsheetTimeZone() || "Asia/Kuala_Lumpur";
    row[1] = Utilities.formatDate(new Date(), tz, "dd/MM/yyyy");

    sheet.getRange(lastDataRow + 1, 1, 1, dataCols).setValues([row]);

    return ContentService.createTextOutput(
      JSON.stringify({ ok: true, rowNumber: nextNo })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: err.message })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
