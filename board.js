let debugButton = document.getElementById("debugButton");

debugButton.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({active:true, currentWindow: true});

    // "scripting" permission required in manifest.json
    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        function: getMembers,
    });
});

function getMembers() {
    let memberTable = document.getElementsByClassName("attendance-table-contents")[1];
    console.log(memberTable);
    let numRows = memberTable.rows.length;
    console.log(numRows);
    for (i = 0; i < numRows; i++) {
        var cells = memberTable.rows.item(i).cells;
        var nameCell = cells[0];
        console.log(nameCell);
        let name = nameCell.getElementsByClassName("attendance-custom-input-text fs-exclude")[0].innerHTML;
        console.log(name);
    }
    console.log("aaaaa");
}