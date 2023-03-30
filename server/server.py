from typing import Union
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from pathlib import Path



dataset_path = Path(__file__).parent.parent / "Data/xlsx/TAS Accident (No Month Attribute) - Filtered.xlsx"
dataset = pd.read_excel(dataset_path)

dataset_heatmap_path = Path(__file__).parent.parent / \
    "Data/xlsx/accident_data.csv"
dataset_heatmap = pd.read_csv(dataset_heatmap_path)

print(">>> loaded dataset")


CODES = {
    "SUCCESS": 200,
    "INVALID": 400,
}
def convert_string(input_string):
    words = input_string.split("_")
    capitalized_words = [word.capitalize() for word in words]
    output_string = " ".join(capitalized_words)
    return output_string

def get_sankey_data(year, mun_tokens, factors):
    global dataset
    
    # Filter by year and mun_tokens
    df = dataset[dataset['year'] == year]
    df = df[df['mun_token'].isin(mun_tokens)]
    
    # Get frequency of datapoints for each mun_token and factor combination
    rows = []
    for mun_token in mun_tokens:
        for factor in factors:
            freq = len(df[(df['mun_token'] == mun_token) & (df[factor] == 'Yes')])
            rows.append([mun_token, factor, freq])
    
    for row in rows:
        row[0] = convert_string(row[0])
        row[1] = convert_string(row[1])
    
    # Transform into JSON object
    data = {
        "year": year,
        "rows": rows
    }
    return data


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def read_root():
    return {"Hello": "World"}


@app.post("/getAccidents")
async def getAccidents(info : Request):
    req_info = await info.json()
    print(req_info)

    year = int(req_info['year'])
    mun_tokens = req_info['mun_tokens']
    factors = req_info['factors']

   
    if (year in [2017, 2018, 2019, 2020, 2021]) and  (len(mun_tokens) <= 5 and len(mun_tokens) > 0) and (len(mun_tokens) > 0):
        res = get_sankey_data(year, mun_tokens, factors)
        return {
            "status" : CODES["SUCCESS"],
            "res" : res
        }
    else: 
        return {
            "status" : CODES["INVALID"],
            "res" : "Invalid request"
        }


@app.post("/getHeatmapData")
async def getHeatmapData(info : Request):
    req_info = await info.json()
    location = req_info['location']
    condition_encoding = {
        "Unknown": 0,
        "Dry": 1,
        "Muddy": 2,
        "Wet": 6,
        "Ice": 8,
        "Other": 5,
        "Slush": 10,
        "Snow": 11,
    }
    month_encoding = {
        "January": 1,
        "February": 2,
        "March": 3,
        "April": 4,
        "May": 5,
        "June": 6,
        "July": 7,
        "August": 8,
        "September": 9,
        "October": 10,
        "November": 11,
        "December": 12,
    }
    
    return req_info


@app.get("/test")
async def getHeatmapData():
    return {
        "data": "TESTING",
        "status": 200
    }
