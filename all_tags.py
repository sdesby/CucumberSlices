from sys import stdin
from path import Path
import json
from collections import defaultdict

folder_path = raw_input()

feature_files = []
tags = []

try:
    # Store all .feature files of specified folder
    for element in Path(folder_path).walkfiles():
        if element.endswith('.feature'):
            feature_files.append(element)

    if not feature_files:
        print "ERROR: No feature files in folder: " + folder_path
    else:
        for f in feature_files:
            fic = open(f, "r")
            lines = fic.readlines()
            for l in lines:
                index = l.find('@')
                if index != -1:  # means we found @
                    current_tags_list = l.split()
                    tags.append(current_tags_list)
            fic.close()

        if not tags:
            print "ERROR. No tags founds in those .feature files"
        else:
            final_tags = defaultdict(list)
            for tag in tags:
                for e in tag:
                    if e not in final_tags:
                        e.replace("\"", "")
                        final_tags["tags"].append(e)

            final_tags["tags"] = list(set(final_tags["tags"]))
            print json.dumps(final_tags)

except IOError:
    print "Error : not able to read the specified path"
