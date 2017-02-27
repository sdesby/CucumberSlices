from path import Path
import os
import sys
import json
from collections import defaultdict


# ---------------------------------------


def print_tags_in_file(tags_in_file_dict):
    output_file = open("which_tags_in_which_files.txt", "w")
    for key in sorted(tags_in_file_dict):
        output_file.write(key)
        output_file.write(": \n")
        output_file.write(str(tags_in_file_dict[key]))
        output_file.write("\n\n")
    output_file.close()
    LOGGER.info("File which_tags_in_which_files.txt has been created")

# ---------------------------------------

folder = raw_input()

feature_files = []
tags = []
tags_in_file = defaultdict(list)

# ---------------------------------------

try:
    # Store all .feature files of specified folder
    for element in Path(folder).walkfiles():
        if element.endswith('.feature'):
            feature_files.append(element)

    if not feature_files:
        sys.exit(0)
    else:
        for feature_file in feature_files:
            fic = open(feature_file, "r")
            lines = fic.readlines()
            for line in lines:
                index = line.find('@')
                if index != -1:
                    current_tags_list = line.split()
                    tags.append(current_tags_list)

                    file_name = feature_file.encode("utf-8")
                    file_name = file_name.replace(folder, "")
                    for tag in current_tags_list:
                        if tag not in tags_in_file[file_name]:
                            tags_in_file[file_name].append(tag)
        fic.close()
        print json.dumps(tags_in_file)

except IOError, RuntimeError:
    print "Error: not able to read the specified path"
sys.exit(0)
