function doPost(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('RSVP') || ss.insertSheet('RSVP');

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Timestamp','Name','Phone','Guests','Status','Notes']);
    sheet.setFrozenRows(1);
  }

  const data = JSON.parse(e.postData.contents);
  const phone = String(data.phone || '').trim();
  const values = [[new Date(), data.name || '', phone, Number(data.guests || 0), data.status || '', data.notes || '']];
  const rows = sheet.getDataRange().getValues();
  let updateRow = 0;

  for (let i = 1; i < rows.length; i++) {
    if (phone && String(rows[i][2]).trim() === phone) {
      updateRow = i + 1;
      break;
    }
  }

  if (updateRow) {
    sheet.getRange(updateRow, 1, 1, 6).setValues(values);
  } else {
    sheet.getRange(sheet.getLastRow() + 1, 1, 1, 6).setValues(values);
  }

  return ContentService.createTextOutput(JSON.stringify({success:true}))
    .setMimeType(ContentService.MimeType.JSON);
}
