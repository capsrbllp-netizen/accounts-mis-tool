const SHEET_NAME = "MIS Submissions";

function doGet(e) {
  try {
    const action = e.parameter.action;

    if (action === 'get') {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const sheet = ss.getSheetByName(SHEET_NAME);

      if (!sheet || sheet.getLastRow() < 2) {
        return jsonResponse({ status: 'ok', rows: [] });
      }

      const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      const data    = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();

      const rows = data.map((row, i) => {
        const obj = {};
        headers.forEach((h, j) => obj[camelCase(h)] = row[j]);
        obj.rowIndex = i + 2; // actual sheet row number (1-indexed, row 1 = header)
        return obj;
      });

      return jsonResponse({ status: 'ok', rows: rows.reverse() }); // newest first
    }

    return jsonResponse({ status: 'error', message: 'Unknown action' });

  } catch (err) {
    return jsonResponse({ status: 'error', message: err.message });
  }
}

function doPost(e) {
  try {
    const data   = e.parameter;
    const action = data.action;
    const ss     = SpreadsheetApp.getActiveSpreadsheet();

    // ── Save management remark ──────────────────────────────────────────────
    if (action === 'remark') {
      let sheet = ss.getSheetByName(SHEET_NAME);
      if (!sheet) return jsonResponse({ status: 'error', message: 'Sheet not found' });

      const rowIndex  = Number(data.rowIndex);
      const lastCol   = sheet.getLastColumn();
      const headers   = sheet.getRange(1, 1, 1, lastCol).getValues()[0];

      // Find or create "Management Remark" column
      let remarkCol = headers.indexOf('Management Remark') + 1;
      if (remarkCol === 0) {
        remarkCol = lastCol + 1;
        sheet.getRange(1, remarkCol).setValue('Management Remark').setFontWeight('bold').setBackground('#1a56db').setFontColor('#ffffff');
      }

      sheet.getRange(rowIndex, remarkCol).setValue(data.mgmtRemark || '');
      return jsonResponse({ status: 'ok' });
    }

    // ── New MIS submission ──────────────────────────────────────────────────
    let sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow([
        'Submitted At', 'Name', 'Date', 'Invoices Processed',
        'Invoice Value (₹)', 'Payments Collected (₹)', 'Payments Pending (₹)',
        'Reconciliation Status', 'Reconciliation Remarks',
        'Pending Tasks / Follow-ups', 'Additional Notes'
      ]);
      sheet.getRange(1, 1, 1, 11).setFontWeight('bold').setBackground('#1a56db').setFontColor('#ffffff');
      sheet.setFrozenRows(1);
    }

    sheet.appendRow([
      data.submittedAt,
      data.name,
      data.date,
      data.invoicesCount,
      data.invoicesValue,
      data.paymentsCollected,
      data.paymentsPending,
      data.reconStatus,
      data.reconRemarks,
      data.pendingTasks,
      data.notes
    ]);

    return jsonResponse({ status: 'ok' });

  } catch (err) {
    return jsonResponse({ status: 'error', message: err.message });
  }
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function camelCase(str) {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase())
    .replace(/[^a-zA-Z0-9]/g, '');
}
