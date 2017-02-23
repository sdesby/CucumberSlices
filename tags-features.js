var PythonShell = require('python-shell');

function getAllTags() {
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

function getFilesForTag() {
    var pyshell = new PythonShell('which_files_for_tag.py');

    working_folder = document.getElementById("actual-folder").value;
    console.log(working_folder);

    if (working_folder == "") {
        alert("Please choose a working folder first");
    }
    else {
        pyshell.send(working_folder);

        pyshell.on('message', function(message) {
        console.log(message)
        var json_from_python = JSON.parse(message);
        var result = "<div><b>";
        for (key in json_from_python) {
            result = result + key + "</b><ul>";
            var values = json_from_python[key];
            values.sort();
            for (var value in values) {
                result += "<li>" + values[value] + "</li>\n";
            }
            result += "</ul></div>";
        }

        document.getElementById("main").innerHTML = result;
        // return message
        });

        pyshell.end(function (err) {
        if(err) throw err;
        console.log('finished');
        });
    }
}
