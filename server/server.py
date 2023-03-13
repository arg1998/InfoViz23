from typing import Union
from fastapi import FastAPI, Request
import pandas as pd
from pathlib import Path

dataset_path = Path(__file__).parent.parent / "Data/xlsx/TAS Accident (No Month Attribute) - Filtered.xlsx"

# dataset = pd.read_excel(dataset_path)
print(">>> loaded dataset")

app = FastAPI()


@app.get("/")
async def read_root():
    return {"Hello": "World"}

@app.post("/getInformation")
async def getInformation(info : Request):
    req_info = await info.json()
    return {
        "status" : "SUCCESS",
        "data" : req_info
    }

@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}