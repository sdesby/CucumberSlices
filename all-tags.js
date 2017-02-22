function getAllTags() {
    var PythonShell = require('python-shell');
    var pyshell = new PythonShell('all_tags.py');

    working_folder = document.getElementById("actual-folder").value;
    console.log(working_folder);

    if (working_folder == "") {
        alert("Please choose a working folder first");
    }
    else {
        pyshell.send(working_folder);

        pyshell.on('message', function(message) {

        var tags = JSON.parse(message);
        var table = "<ul>";
        var listOfTags = tags["tags"];
        listOfTags.sort();
        for (var tag in listOfTags) {
            table += "<li>" + listOfTags[tag] + "</li>\n";
        }
        table += "</ul>";
        document.getElementById("main").innerHTML = table;
        // return message
        });

        pyshell.end(function (err) {
        if(err) throw err;
        console.log('finished');
        });
    }
}
