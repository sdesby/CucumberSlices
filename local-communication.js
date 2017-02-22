function selectWorkingFolder() {
    var remote = require('electron').remote;
    var dialog = remote.dialog;
    var fs = require('fs');

        dialog.showOpenDialog({
            title:"Select a folder",
            properties: ["openDirectory"]
        },function (folderPaths) {
    // folderPaths is an array that contains all the selected paths
    if(folderPaths === undefined){
        console.log("No destination folder selected");
        return;
    } else{
        document.getElementById("actual-folder").value = folderPaths;
        console.log(folderPaths);
    }
    });
}
