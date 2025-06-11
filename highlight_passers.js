function highlightMatchingIDs() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const name_sheet = ss.getSheetByName('Name/Position Reference Sheet');
  const rangeToFormat = name_sheet.getRange("E:E"); // Column E to format
  const formula = '=COUNTIF(F:F, E1)>0';      // Compare E to F

  // Remove any existing formatting rules for Column E (optional)
  const rules = name_sheet.getConditionalFormatRules();
  const newRules = rules.filter(rule => {
    const ranges = rule.getRanges();
    return !ranges.some(r => r.getA1Notation() === 'E:E');
  });

  // Create and apply the new conditional formatting rule
  const rule = SpreadsheetApp.newConditionalFormatRule()
    .setRanges([rangeToFormat])
    .whenFormulaSatisfied(formula)
    .setBackground("#FFFF00") // Yellow highlight
    .build();

  newRules.push(rule);
  name_sheet.setConditionalFormatRules(newRules);

  SpreadsheetApp.flush();
}
