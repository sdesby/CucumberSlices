# -*- coding: UTF-8 -*-
import os
from modules.path import Path
import sys
from collections import defaultdict
import json


# ---------------------------------------

folder = raw_input()

feature_files = []
tags = []
files_for_tag = defaultdict(list)

# ---------------------------------------

try:
    # Store all .feature files of specified folder
    for element in Path(folder).walkfiles():
        if element.endswith('.feature'):
            feature_files.append(element)

    if not feature_files:
        print("ERROR: No .feature files in this folder")
    else:
        for feature_file in feature_files:
            fic = open(feature_file, "r")
            lines = fic.readlines()
            for line in lines:
                index = line.find('@')
                if index != -1:
                    if line.startswith("@"):
                        current_tags_list = line.split()
                        tags.append(current_tags_list)
                        for tag in current_tags_list:
                            file_name = feature_file.encode("utf-8")
                            file_name = file_name.replace(folder, "")
                            if file_name not in files_for_tag[tag]:
                                files_for_tag[tag].append(file_name)
        fic.close()
        print json.dumps(files_for_tag)

except IOError, RuntimeError:
    print "ERROR: not able to read the specified path"
