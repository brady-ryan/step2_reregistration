function highlightMatchingIDs() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const name_sheet = ss.getSheetByName('Name/Position Reference Sheet');
  const rangeToFormat = name_sheet.getRange("E2:E"); // Skip header row
  const formula = '=COUNTIF(F:F, INDIRECT("E"&ROW()))>0'; // Correct per-row comparison

  // Remove existing formatting rules for Column E
  const rules = name_sheet.getConditionalFormatRules();
  const newRules = rules.filter(rule => {
    const ranges = rule.getRanges();
    return !ranges.some(r => r.getA1Notation() === 'E:E' || r.getA1Notation() === 'E2:E');
  });

  // Create and apply the corrected conditional formatting rule
  const rule = SpreadsheetApp.newConditionalFormatRule()
    .setRanges([rangeToFormat])
    .whenFormulaSatisfied(formula)
    .setBackground("#FFFF00")
    .build();

  newRules.push(rule);
  name_sheet.setConditionalFormatRules(newRules);

  SpreadsheetApp.flush();
}
