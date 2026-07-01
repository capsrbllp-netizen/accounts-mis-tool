# MIS Tool — Setup Guide

## What you need
- A Google account
- A Google Sheet (new or existing)
- 5 minutes

---

## Step 1 — Create the Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) and create a new blank spreadsheet.
2. Name it **"Accounts MIS"** (or anything you like).

---

## Step 2 — Add the Apps Script

1. In your Google Sheet, click **Extensions → Apps Script**.
2. Delete any existing code in the editor.
3. Open the file `apps-script.js` from this folder and **copy all its contents**.
4. Paste it into the Apps Script editor.
5. Click **Save** (floppy disk icon or Ctrl+S).

---

## Step 3 — Deploy as a Web App

1. Click **Deploy → New deployment**.
2. Click the gear icon ⚙️ next to "Select type" and choose **Web app**.
3. Fill in:
   - **Description:** MIS Tool
   - **Execute as:** Me
   - **Who has access:** Anyone  *(so the form can reach it without login)*
4. Click **Deploy**.
5. When prompted, click **Authorize access** and follow the Google sign-in flow.
6. After deployment, copy the **Web app URL** — it looks like:
   `https://script.google.com/macros/s/AKfycb.../exec`

---

## Step 4 — Connect the Form

1. Open `index.html` in any text editor (Notepad, VS Code, etc.).
2. Find this line near the bottom:
   ```
   const APPS_SCRIPT_URL = "";
   ```
3. Paste your URL inside the quotes:
   ```
   const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycb.../exec";
   ```
4. Save the file.

---

## Step 5 — Share the Form

- Share the `index.html` file with your team (via email, shared drive, or internal server).
- Each team member simply opens it in their browser — no installation needed.
- Every submission appears as a new row in your Google Sheet automatically.

---

## Re-deploying after edits

If you ever update the Apps Script code, you must create a **new deployment** (not edit the existing one) for changes to take effect. Go to Deploy → New deployment and repeat Step 3.

---

## Fields captured per submission

| Field | Type |
|---|---|
| Submitted At | Timestamp |
| Name | Text |
| Date | Date |
| Invoices Processed | Number |
| Invoice Value (₹) | Number |
| Payments Collected (₹) | Number |
| Payments Pending (₹) | Number |
| Reconciliation Status | Completed / Partial / Pending / N/A |
| Reconciliation Remarks | Text |
| Pending Tasks / Follow-ups | Text |
| Additional Notes | Text |
