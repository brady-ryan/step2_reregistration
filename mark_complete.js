function updateEboardQuizStatus() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet1 = ss.getSheetByName('Name/Position Reference Sheet');
  const sheet2 = ss.getSheetByName('Step 2: Tracker');

  const lastRow = sheet1.getLastRow();

  // Get Columns E and F from Sheet1
  const idsColumnE = sheet1.getRange('E2:E' + lastRow).getValues().flat();
  const idsPassed = sheet1.getRange('F2:F' + lastRow).getValues().flat().filter(x => x);

  // Load full data from Sheet1 (including header)
  const data1 = sheet1.getDataRange().getValues();
  const data2 = sheet2.getDataRange().getValues();
  const headers = data2[0];

  // Map positions to columns in Sheet2
  const posCols = {
    "President": headers.indexOf("President"),
    "Vice President": headers.indexOf("Vice President"),
    "Secretary": headers.indexOf("Secretary"),
    "Treasurer": headers.indexOf("Treasurer"),
  };

  // Map org names to row numbers in Sheet2
  const orgRowMap = {};
  for (let r = 1; r < data2.length; r++) {
    const rawOrgName = data2[r][0];
    if (rawOrgName) {
      const orgName = rawOrgName.toString().normalize().trim().toLowerCase();
      orgRowMap[orgName] = r + 1; // 1-based row numbers
    }
  }

  const total = idsPassed.length;
  let count = 0;

  for (const passedId of idsPassed) {
    let foundMatch = false;

    idsColumnE.forEach((idValue, indexInE) => {
      if (idValue === passedId) {
        foundMatch = true;

        const row = data1[indexInE + 1]; // +1 to skip header
        const rawOrgName = row[0];
        const position = row[3];

        if (!rawOrgName || !position) {
          Logger.log(`⚠️ Missing org or position for ID ${passedId} at Sheet1 row ${indexInE + 2}`);
          return;
        }

        const orgKey = rawOrgName.toString().normalize().trim().toLowerCase();
        const targetRow = orgRowMap[orgKey];
        const targetColIndex = posCols[position];

        if (!targetRow || targetColIndex === -1) {
          Logger.log(`⚠️ Could not map org "${rawOrgName}" or position "${position}" for ID ${passedId}`);
          return;
        }

        const targetCol = targetColIndex + 1;
        const cell = sheet2.getRange(targetRow, targetCol);
        const currentValue = cell.getValue();

        if (currentValue === "") {
          cell.setValue("Quiz Complete");
        } else if (currentValue === "Eboard Form Complete") {
          cell.setValue("Quiz & Form Complete");
        }

        // Progress tracking
        count++;
        if (count % 20 === 0 || count === total) {
          const progress = Math.floor((count / total) * 100);
          const barLength = 10;
          const filled = Math.floor(progress / 10);
          const bar = `[${'#'.repeat(filled)}${'-'.repeat(barLength - filled)}] ${progress}% complete (${count} of ${total})`;
          Logger.log(bar);
        }
      }
    });

    if (!foundMatch) {
      Logger.log(`⚠️ ID ${passedId} not found in Column E of Sheet1`);
    }
  }

  SpreadsheetApp.flush();
}

