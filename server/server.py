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
    data = {}
    all_factors = {}
    for mun_token in mun_tokens:
        data[mun_token] = {
            "total_accidents": 0,
            "factors": {}
        }
        for factor in factors:
            freq = len(df[(df['mun_token'] == mun_token) & (df[factor] == 'Yes')])
            data[mun_token]["total_accidents"] += freq
            data[mun_token]["factors"][factor] = freq
            
    
    for factor in factors:
        all_factors[factor] = 0
        for mun_token in mun_tokens:
            all_factors[factor] += data[mun_token]["factors"][factor]
        
    
    # Transform into JSON object
    data = {
        "year": year,
        "data": data, 
        "all_factors": all_factors
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
        
        
    
