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
        var json_from_python = JSON.parse(message);
        var result = "";
        for (key in json_from_python) {
            result += "<div class=\"answer-container\">";
            result += "<div class=\"key\"><b>" + key + "</b></div>";

            var values = json_from_python[key];
            values.sort();
            result += "<div class=\"values\"><ul>";
            for (var value in values) {
                result += "<li>" + values[value] + "</li>\n";
            }
            result += "</ul></div>";
            result+= "</div>";
        }
        document.getElementById("main").innerHTML = result;
        });

        pyshell.end(function (err) {
        if(err) throw err;
        console.log('finished');
        });
    }
}
