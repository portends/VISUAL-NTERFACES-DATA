import csv
import json
from os import listdir


def filesFromFolder(path, out_file):
    data = []
    for file in listdir(path):
        with open(path + file) as f:
            f_reader = csv.DictReader(f)

            for rows in f_reader:
                data.append(rows)

    with open(out_file, "w") as jsonf:
        jsonf.write(json.dumps(data, indent=4))


filesFromFolder("../../../School/Spring2022/Data_Viz/projects/project1_data/", "annual_aqi_by_county_1980_2021.json")
