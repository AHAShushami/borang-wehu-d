/**
 * Google Apps Script (Code.gs) untuk Google Sheet WEHU_D
 * Spreadsheet ID: 1zmq-qaZW5EGiWWGAJ1a1zhgGch11AhdMRUI7lI7wRJg
 * Format: 64 Lajur Data (A:BL) + Lajur ke-65 Rekod_Link (BM - Formula Automatik)
 */

const SPREADSHEET_ID = "1zmq-qaZW5EGiWWGAJ1a1zhgGch11AhdMRUI7lI7wRJg";
const SHEET_NAME = "WEHU_D";

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
        JSON.stringify({ ok: false, error: "Parameter 'ic' dan 'date' diperlukan." })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const tz = ss.getSpreadsheetTimeZone() || "Asia/Kuala_Lumpur";
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];

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

    const displayValues = sheet.getRange(2, 1, lastDataRow - 1, 64).getDisplayValues();
    let matchedRow = null;
    let matchedSheetRow = -1;

    for (let i = displayValues.length - 1; i >= 0; i--) {
      const r = displayValues[i];
      const rowNo = String(r[0] || "").trim();
      const rowDate = normalizeDateStr(r[1], tz);
      const rowIc = normalizeIc(r[11]); // Column L (index 11) = NEW IC /PASSPORT NO.

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
    const payload = JSON.parse(e.postData.contents);
    const row = Array.isArray(payload.row) ? payload.row.slice(0, 64) : null;
    if (!row || row.length !== 64) {
      throw new Error("Format data tidak sah: memerlukan 64 lajur data.");
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];

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

    sheet.getRange(lastDataRow + 1, 1, 1, 64).setValues([row]);

    return ContentService.createTextOutput(
      JSON.stringify({ ok: true, rowNumber: nextNo })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: err.message })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
