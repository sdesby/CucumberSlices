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
            if(message.startsWith("ERROR")) {
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

        pyshell.end(function (err) {
        if(err) throw err;
        console.log('finished');
        });
    }
}

function hideAndShow(){
    jQuery(function(){
            jQuery('.key').click(function(){
                  $(this).siblings("div.values").toggle();
                  var splittedActualTxt = $(this).text().split(" ");
                  var txtToDisplay = splittedActualTxt[0] + " " + splittedActualTxt[1];
                  if(txtToDisplay.indexOf("Replier") >= 0){
                      $(this).html("<b>" + txtToDisplay + "</b>     <span class=\"accordeon\">Déplier</span>");
              } else {
                  $(this).html("<b>" + txtToDisplay + "</b>     <span class=\"accordeon\">Replier</span>");
              }

            });
    });
}

function clearStepsList() {
    if(document.getElementById("steps-list")) {
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
    }
    else {
        pyshell.send(working_folder);

        pyshell.on('message', function(message) {
            if(message.startsWith("ERROR")) {
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
            result+= "</div>";
        }

        document.getElementById("main").innerHTML = result;
        hideAndShow();
}
        });

        pyshell.end(function (err) {
        if(err) throw err;
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
    }
    else {
        pyshell.send(working_folder);

        pyshell.on('message', function(message) {
            if(message.startsWith("ERROR")) {
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
            result+= "</div>";
        }

        document.getElementById("main").innerHTML = result;
        hideAndShow();
        console.log(message);
}
        });

        pyshell.end(function (err) {
        if(err) throw err;
        console.log('finished');
        });
    }
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
    }

    else {
        var options = {
              mode: 'text',
              pythonPath: '/usr/bin/python',
              pythonOptions: [],
              scriptPath: '',
              args: [working_folder, choosen_tag]
        };
        pyshell.run("extract_all_steps_for_tag.py", options, function (err, results) {
          if (err) throw err;
          // results is an array consisting of messages collected during execution

          try {
              var keywords = ["Soit", "Etant donné", "Quand", "Alors", "Et"];
              var result = document.getElementById("main").innerHTML;

              result += "<div id=\"steps-list\">"

              for (keyword in keywords) {
                  var cell = results[keyword].split("|");
                  cell.splice(-1, 1)
                  result += "<div class=\"answer-container\">";
                  result += "<div class=\"key\"><b>" + keywords[keyword] + " (" + cell.length + ")</b>     <span class=\"accordeon\">Déplier</span></div>";
                  result += "<div class=\"values\"><ul>";
                  for (var i in cell) {
                      result += "<li class=\"result-list\">" + cell[i] + "</li>\n";
                  }
                  result += "</ul></div>";
                  result+= "</div>";
              }

              result += "</div>"

              document.getElementById("main").innerHTML = result;
              document.getElementById("actual-tag").placeholder = choosen_tag;
              hideAndShow();
          }
          catch(err) {
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
