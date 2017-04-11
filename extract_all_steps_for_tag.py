#!/usr/bin/python
# -*- coding: UTF-8 -*-

from path import path
import argparse
import logging
import sys
import json
import codecs
import re
from collections import defaultdict

root = logging.getLogger()
root.setLevel(logging.DEBUG)

ch = logging.StreamHandler(sys.stdout)
ch.setLevel(logging.DEBUG)
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(name)s -  %(message)s')
ch.setFormatter(formatter)
root.addHandler(ch)

LOGGER=logging.getLogger("extractAllStepsForTags")

parser = argparse.ArgumentParser(description='Process feature files from folder and search for tag')

#parser.add_option("-t", "--tag", dest="tagname", help="tag to extract scenarios from. Default is \"@excalibur\"", default="@excalibur")
parser.add_argument("folder", type=str)
parser.add_argument("tag", type=str)
parser.add_argument("keywords", type=str)
args = parser.parse_args()

#folder_name = raw_input("Enter the folder you want to extract the steps from : ")

scenarios = []
feature_files = []
feature_files_with_tag = []
keyword = u'Scénario'

def fetch_keyword_steps(files, keyword):
    steps = []
    for f in files:
        fic = open(f, "r")
        lines = fic.readlines()
        for l in lines:
            index = l.find(keyword)
            if index != -1:
                if l.lstrip().startswith(keyword):
                    steps.append(l.lstrip())
    fic.close()
    if len(steps) > 0:
        steps = list(set(steps))
        steps.sort()
        for index, step in enumerate(steps):
            steps[index] = step.replace("\n", "")
        return "|".join(steps)
    else:
        return None

try:

    folder_name = args.folder
    tag_name = args.tag
    for element in path(folder_name).walkfiles():
        if element.endswith('.feature'):
            feature_files.append(element)

    if not feature_files:
        print "ERROR: No .feature files in this folder"
    else:
        for f in feature_files:
            fic = open(f, "r")
            lines = fic.readlines()
            for l in lines:
                index_for_tag = l.find(tag_name)
                if index_for_tag != -1 :
                    feature_files_with_tag.append(f)
            fic.close()

        if not feature_files_with_tag:
            print "ERROR: Tag not find. Please enter an existing tag for choosen folder."
        else:
            result_dict = defaultdict(list)
            for key in args.keywords.split("|"):
                fetched = fetch_keyword_steps(feature_files_with_tag, key)
                if fetched is not None:
                    for step in fetched.split("|"):
                        if step not in result_dict[key]:
                            result_dict[key].append(step)
            print json.dumps(result_dict)

except IOError, RuntimeError:
    print "ERROR: not able to read the specified path"
