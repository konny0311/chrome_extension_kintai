let debugButton = document.getElementById("debugButton");

debugButton.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({active:true, currentWindow: true});

    // "scripting" permission required in manifest.json
    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        function: getInfo
    });
});

function getInfo() {
    // get members name
    let memberTable = document.getElementsByClassName("attendance-table-contents")[1];
    let members = [];
    let numRows = memberTable.rows.length;
    console.log(numRows);
    for (i = 0; i < numRows; i++) {
        var cells = memberTable.rows.item(i).cells;
        var nameCell = cells[0];
        let name = nameCell.getElementsByClassName("attendance-custom-input-text fs-exclude")[0].innerHTML;
        console.log(name);
        members.push(name);
    }
    console.log(members);

    // get working hours
    let aveHours = [];
    let attendanceTable = document.getElementsByClassName("attendance-table-contents")[3];
    console.log(attendanceTable);
    let attendanceRows = attendanceTable.rows.length;
    for (i = 0; i < attendanceRows; i++) {
        let cells = attendanceTable.rows.item(i).cells;
        let daysCell = cells[0];
        let hoursCell = cells[6];
        let days = parseFloat(daysCell.innerHTML.replace(/[\u3400-\u9FFF]/g, "")); // Remove Kanji
        let hours = parseFloat(hoursCell.innerHTML.replace("h", "")); // Remove h
        if (days != 0) {
            let ave = hours/days;
            aveHours.push(ave);
            console.log("Average working hours per day", ave);
        } else {
            aveHours.push(0);
            console.log("No working day so far.")
        }
    }

    console.log(members.length);
    console.log(aveHours.length);
}