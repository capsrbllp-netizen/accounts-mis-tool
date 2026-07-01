// Google Apps Script — paste this entire file into script.google.com
// Appends each MIS submission as a new row in the active Google Sheet.

const SHEET_NAME = "MIS Submissions"; // Change if you want a different tab name

function doPost(e) {
  try {
    const data = e.parameter;
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    let sheet = ss.getSheetByName(SHEET_NAME);

    // Create the sheet and header row on first run
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow([
        "Submitted At",
        "Name",
        "Date",
        "Invoices Processed",
        "Invoice Value (₹)",
        "Payments Collected (₹)",
        "Payments Pending (₹)",
        "Reconciliation Status",
        "Reconciliation Remarks",
        "Pending Tasks / Follow-ups",
        "Additional Notes"
      ]);
      // Bold the header row
      sheet.getRange(1, 1, 1, 11).setFontWeight("bold").setBackground("#1a56db").setFontColor("#ffffff");
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

    return ContentService
      .createTextOutput(JSON.stringify({ status: "ok" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: test this function manually inside the Apps Script editor
function testPost() {
  const mock = {
    postData: {
      contents: JSON.stringify({
        submittedAt: "01/07/2026, 6:00:00 pm",
        name: "Test User",
        date: "2026-07-01",
        invoicesCount: 10,
        invoicesValue: 50000,
        paymentsCollected: 30000,
        paymentsPending: 5000,
        reconStatus: "Completed",
        reconRemarks: "",
        pendingTasks: "Follow up with vendor X",
        notes: "All clear"
      })
    }
  };
  const result = doPost(mock);
  Logger.log(result.getContent());
}
