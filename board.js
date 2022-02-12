let debugButton = document.getElementById("debugButton");

function getInfo() {
    // get members name
    let memberTable = document.getElementsByClassName("attendance-table-contents")[1];
    let members = [];
    let numRows = memberTable.rows.length;
    for (i = 0; i < numRows; i++) {
        var cells = memberTable.rows.item(i).cells;
        var nameCell = cells[0];
        let name = nameCell.getElementsByClassName("attendance-custom-input-text fs-exclude")[0].innerHTML;
        members.push(name);
    }

    // get working hours
    let aveHours = [];
    let attendanceTable = document.getElementsByClassName("attendance-table-contents")[3];
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
        } else {
            aveHours.push(0);
        }
    }

    var info = {};
    members.map(function(member, i) {
         info[member] = aveHours[i]
        });
    
    // Descending sort
    var sortedInfo = Object.keys(info).map((k)=>({ key: k, value: info[k] }));
    sortedInfo.sort((a, b) => a.value - b.value);
    return sortedInfo;
}

function insertInfo(info) {
    let tbody = document.getElementById("attendanceBody");
    for (i = 0; i < info.length; i++) {
        let newRow = tbody.insertRow(0);
        var newCell = newRow.insertCell(0);
        // Hours
        var hours = info[i].value;
        var hourText = document.createTextNode(hours);
        newCell.appendChild(hourText);
        var newCell = newRow.insertCell(0);
        // Name
        var nameText = document.createTextNode(info[i].key);
        newCell.appendChild(nameText);
        if (hours >=8) {
            newRow.style.color = "green";
        }
        if (hours >= 9) {
            newRow.style.color = "red";
        }            
    };
}

document.addEventListener('DOMContentLoaded', async () => {
    let [tab] = await chrome.tabs.query({active:true, currentWindow: true});

    // "scripting" permission required in manifest.json
    var ret = chrome.scripting.executeScript({
        target: {tabId: tab.id},
        function: getInfo
    });
    ret.then(val => {insertInfo(val[0]["result"])})
          .catch(err => {console.log(err)});
});