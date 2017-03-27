var PythonShell = require('python-shell');
const JsonReader = require("load-json-file");

function getAllTags() {
    var pyshell = new PythonShell('all_tags.py');

    working_folder = document.getElementById("actual-folder").value;
    console.log(working_folder);

    if (working_folder == "") {
        alert("Please choose a working folder first");
    } else {
        pyshell.send(working_folder);

        pyshell.on('message', function(message) {
            if (message.startsWith("ERROR")) {
                alert(message);
            } else {

                var tags = JSON.parse(message);
                var table = "<ul>";
                var listOfTags = tags["tags"];
                listOfTags.sort();
                for (var tag in listOfTags) {
                    table += "<li class=\"result-list\">" + listOfTags[tag] + "</li>\n";
                }
                table += "</ul>";
                document.getElementById("main").innerHTML = table;
                // return message
            }
        });

        pyshell.end(function(err) {
            if (err) throw err;
            console.log('finished');
        });
    }
}

function hideAndShow() {
    jQuery(function() {
        jQuery('.key').click(function() {
            $(this).siblings("div.values").toggle();
            var splittedActualTxt = $(this).html();
            var txtToDisplay = splittedActualTxt.substr(splittedActualTxt.indexOf("<b>"), splittedActualTxt.indexOf("</b>"));
            if ($(this).text().indexOf("Replier") >= 0) {
                $(this).html("<b>" + txtToDisplay + "</b>     <span class=\"accordeon\">Déplier</span>");
            } else {
                $(this).html("<b>" + txtToDisplay + "</b>     <span class=\"accordeon\">Replier</span>");
            }
        });
    });
}

function clearStepsList() {
    if (document.getElementById("steps-list")) {
        var element = document.getElementById("steps-list");
        element.outerHTML = "";
        delete element;
    }
}

function getFilesForTag() {
    var pyshell = new PythonShell('which_files_for_tag.py');

    working_folder = document.getElementById("actual-folder").value;
    console.log(working_folder);

    if (working_folder == "") {
        alert("Please choose a working folder first");
    } else {
        pyshell.send(working_folder);

        pyshell.on('message', function(message) {
            if (message.startsWith("ERROR")) {
                alert(message);
            } else {
                var json_from_python = JSON.parse(message);
                var result = "";
                for (key in json_from_python) {
                    result += "<div class=\"answer-container\">";
                    result += "<div class=\"key\"><b>" + key + "</b>     <span class=\"accordeon\">Déplier</span></div>";
                    var values = json_from_python[key];
                    values.sort();
                    result += "<div class=\"values\"><ul>";
                    for (var value in values) {
                        result += "<li class=\"result-list\">" + values[value] + "</li>\n";
                    }
                    result += "</ul></div>";
                    result += "</div>";
                }
                document.getElementById("main").innerHTML = result;
                hideAndShow();
            }
        });

        pyshell.end(function(err) {
            if (err) throw err;
            console.log('finished');
        });
    }
}

function getTagsForFile() {
    var pyshell = new PythonShell('which_tags_in_which_files.py');

    working_folder = document.getElementById("actual-folder").value;
    console.log(working_folder);

    if (working_folder == "") {
        alert("Please choose a working folder first");
    } else {
        pyshell.send(working_folder);

        pyshell.on('message', function(message) {
            if (message.startsWith("ERROR")) {
                alert(message);
            } else {
                var json_from_python = JSON.parse(message);
                var result = "";
                for (key in json_from_python) {
                    result += "<div class=\"answer-container\">";
                    result += "<div class=\"key\"><b>" + key + "</b>     <span class=\"accordeon\">Déplier</span></div>";

                    var values = json_from_python[key];
                    values.sort();
                    result += "<div class=\"values\"><ul>";
                    for (var value in values) {
                        result += "<li class=\"result-list\">" + values[value] + "</li>\n";
                    }
                    result += "</ul></div>";
                    result += "</div>";
                }

                document.getElementById("main").innerHTML = result;
                hideAndShow();
                console.log(message);
            }
        });

        pyshell.end(function(err) {
            if (err) throw err;
            console.log('finished');
        });
    }
}

function getKeywordsFromJson() {
    var json_gherkin_languages = JsonReader.sync("given-when-then.json");
    console.log(json_gherkin_languages);

    var languages = [];
    for (language in json_gherkin_languages) {
        languages.push(language);
    }

    var keywords = [];
    var selected_language = document.getElementById("actual-language").value;
    var language = json_gherkin_languages[selected_language]
    for (keyword in language) {
        console.log("english key: " + keyword);
        var actualKeywordsForLanguages = language[keyword];

        for (k in actualKeywordsForLanguages) {
            keywords.push(actualKeywordsForLanguages[k]);
        }
    }
    console.log("Keywords:");
    console.log(keywords);
    return keywords;
}

function getStepsForTag() {
    var pyshell = require('python-shell');
    working_folder = document.getElementById("actual-folder").value;

    if (working_folder == "") {
        alert("Please choose a working folder first");
    }

    choosen_tag = document.getElementById("actual-tag").value;

    if (choosen_tag == "") {
        alert("Please choose a tag first");

    } else if (!choosen_tag.startsWith("@")) {
        alert("Tag must tart with \"@\"")
    } else {
        keywords = getKeywordsFromJson();
        var keywordsAsString = "";
        for (value in keywords) {
            keywordsAsString += keywords[value] + "|";
        }

        keywordsAsString = keywordsAsString.slice(0, -1);

        var options = {
            mode: 'text',
            pythonPath: '/usr/bin/python',
            pythonOptions: [],
            scriptPath: '',
            args: [working_folder, choosen_tag, keywordsAsString]
        };
        pyshell.run("extract_all_steps_for_tag.py", options, function(err, results) {
            if (err) throw err;
            // results is an array consisting of messages collected during execution

            try {
                if (results[0].startsWith("ERROR")) {
                    alert(results[0]);
                } else {
                    var result = "";
                    var json_from_python = JSON.parse(results);
                    for (key in json_from_python) {
                        var values = json_from_python[key];

                        result += "<div class=\"answer-container\">";
                        result += "<div class=\"key\"><b>" + key + "(" + values.length + ")</b>     <span class=\"accordeon\">Déplier</span></div>";

                        values.sort();
                        result += "<div class=\"values\"><ul>";
                        for (var value in values) {
                            result += "<li class=\"result-list\">" + values[value] + "</li>\n";
                        }
                        result += "</ul></div>";
                        result += "</div>";
                    }

                    document.getElementById("main").innerHTML = document.getElementById("main").innerHTML + result;
                    document.getElementById("actual-tag").placeholder = choosen_tag;
                    hideAndShow();
                }
            } catch (err) {
                document.getElementById("main").innerHTML = err;
            }
        });
    }
}

function chooseTag() {
    document.getElementById('main').innerHTML = "<div id=\"tag-selection-div\">" +
        "<label for=\"actual-tag\">Choosen tag:</label>" +
        "<p><input type=\"text\" class=\"input-text\" placeholder=\"Please select a tag\" id=\"actual-tag\" required onfocus=\"clearStepsList()\"/>" +
        "<button id=\"tag-choice-button\" onclick=\"getStepsForTag()\">Ok</button></p></div>"
}
