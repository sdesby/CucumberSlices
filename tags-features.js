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
        });
    }
}

function hideAndShow() {
    jQuery(function() {
        jQuery('.key').click(function() {
            $(this).siblings("div.values").toggle();
            var splittedActualTxt = $(this).html();
            var txtToDisplay = splittedActualTxt.substr(splittedActualTxt.indexOf("<b>"), splittedActualTxt.indexOf("</b>"));
            if ($(this).text().indexOf("Fold") >= 0) {
                $(this).html("<b>" + txtToDisplay + "</b>     <span class=\"accordeon\">Unfold</span>");
            } else {
                $(this).html("<b>" + txtToDisplay + "</b>     <span class=\"accordeon\">Fold</span>");
            }
        });
    });
}

function clearTagsForFileBody() {
    if (document.getElementById("tagsforfile-body")) {
        var element = document.getElementById("tagsforfile-body");
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
                    result += "<div class=\"key\"><b>" + key + "</b>     <span class=\"accordeon\">Unfold</span></div>";
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
                    result += "<div class=\"key\"><b>" + key + "</b>     <span class=\"accordeon\">Unfold</span></div>";

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

function getKeywordsFromJson() {
    var json_gherkin_languages = JsonReader.sync("given-when-then.json");

    var languages = [];
    for (language in json_gherkin_languages) {
        languages.push(language);
    }

    var keywords = [];
    var selected_language = document.getElementById("actual-language").value;
    var language = json_gherkin_languages[selected_language]
    for (keyword in language) {
        var actualKeywordsForLanguages = language[keyword];

        for (k in actualKeywordsForLanguages) {
            keywords.push(actualKeywordsForLanguages[k]);
        }
    }
    return keywords;
}

function getStepsForTag() {

    working_folder = document.getElementById("actual-folder").value;

    if (working_folder == "") {
        alert("Please choose a working folder first");
        return
    }

    choosen_tag = document.getElementById("actual-tag").value;
    choosen_language = document.getElementById("actual-language").value;

    if (choosen_tag == "") {
        alert("Please choose a tag first");
    } else if (!choosen_tag.startsWith("@")) {
        alert("Tag must tart with \"@\"")
    } else {

        clearTagsForFileBody()

        var pyshell = require('python-shell');

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
            console.log(results);
            if (err) throw err;
            // results is an array consisting of messages collected during execution

            try {
                if (results[0].startsWith("ERROR")) {
                    alert(results[0]);
                } else {
                    var json_from_python = JSON.parse(results);
                    var result = "<div id=\"tagsforfile-body\">";
                    if (Object.keys(json_from_python).length === 0) {
                        result += "<p class=\"error\"> Sorry but no result were found.</p>";
                        result += "</div>";
                        document.getElementById("main").innerHTML = document.getElementById("main").innerHTML + result;
                        document.getElementById("actual-tag").placeholder = choosen_tag;
                        document.getElementById("actual-language").value = choosen_language;

                    } else {
                        for (key in json_from_python) {
                            var values = json_from_python[key];

                            result += "<div id=\"answer-container\" class=\"answer-container\">";
                            result += "<div class=\"key\"><b>" + key + "(" + values.length + ")</b>     <span class=\"accordeon\">Unfold</span></div>";

                            values.sort();
                            result += "<div class=\"values\"><ul>";
                            for (var value in values) {
                                result += "<li class=\"result-list\">" + values[value] + "</li>\n";
                            }
                            result += "</ul></div>";
                            result += "</div>";
                        }
                        result += "</div>";

                        document.getElementById("main").innerHTML = document.getElementById("main").innerHTML + result;
                        document.getElementById("actual-tag").placeholder = choosen_tag;
                        document.getElementById("actual-language").value = choosen_language;
                        hideAndShow();
                    }
                }
            } catch (err) {
                document.getElementById("main").innerHTML = err;
            }
        });
    }
}

function chooseTag() {

    document.getElementById('main').innerHTML = "<div id=\"tagsforfile-head\">" +
        "<div id=\"language-div\">" +
        "<label for=\"actual-language\">Choose your working language:</label>" +
        "<p>" +
        "<select id=\"actual-language\" class=\"select\">" +
        "<option value=\"fr\">Français</option>" +
        "<option value=\"en\">English</option>" +
        "</select></p>" +
        "</div>" +
        "<div id=\"tag-selection-div\">" +
        "<label for=\"actual-tag\">Choose the tag:</label>" +
        "<p><input type=\"text\" class=\"input-text\" placeholder=\"Please select a tag\" id=\"actual-tag\" required/>" +
        "<button id=\"tag-choice-button\" onclick=\"getStepsForTag()\">Ok</button></p></div>" +

        "</div>";
}
