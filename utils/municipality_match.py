import pandas as pd
import json
from pathlib import Path

in_data_path = Path("./Data/xlsx/TAS Accident (No Month Attribute).xlsx").absolute()
in_geo_path = Path("./Data/GeoJson/municpalities_espg4326.json").absolute()
out_filtered_geojson_path = Path("./Data/GeoJson/unicpalities_espg4326_filtered.json").absolute()
out_filtered_data_path = Path("./Data/xlsx/TAS Accident (No Month Attribute) - Filtered.xlsx").absolute()

# reading ICBC dataset and only keeping the municipality and region columns
df = pd.read_excel(in_data_path)
df["mun_token"] = df["Municipality"].str.lower().str.replace(" ", "_")
temp_df = df[["mun_token", "Municipality", "Region"]]
unique_municipalities = temp_df["mun_token"].unique()
print("length of the dataset: ", len(temp_df))
print(F"length of unique municipalities: {len(unique_municipalities)}")


# reading the geojson and extracting the municipality names
geojson = json.load(open(in_geo_path))
municipalities = []
for feature in geojson["features"]:
    municipalities.append(feature["properties"]["ADMIN_AREA_ABBREVIATION"])

print(F"length of municipalities in geojson: {len(municipalities)}")
# tokenizing the municipality names
municipalities = [municipality.lower().replace(" ", "_") for municipality in municipalities]

# finding the intersection of the two lists
intersection = set(unique_municipalities).intersection(set(municipalities))
print(F"length of intersection: {len(intersection)}")

# mask intersection to the dataset indices
mask = temp_df["mun_token"].isin(intersection)
valid_dataset = df[mask]
valid_dataset = valid_dataset.reset_index(drop=True)
print(F"length of dataset after filtering: {len(valid_dataset)}")
print("length of unique municipalities after filtering: ", len(valid_dataset["mun_token"].unique()))

# renaming columns
valid_dataset.columns = valid_dataset.columns.str.lower().str.replace(" ", "_")
valid_dataset.to_excel(out_filtered_data_path, index=False)
print("saved filtered dataset")

# transforming and cleaning the geojson file according to municipality intersection we created
skipped_features = []
accepted_features = []
for feature in geojson["features"]:
    prop = {}
    # tokenized abbreviation of the municipality
    prop["mun_token"] = feature["properties"]["ADMIN_AREA_ABBREVIATION"].lower().replace(" ", "_")
    if prop["mun_token"] not in intersection:
        # skip this feature if it is not in the intersection of municipalities
        skipped_features.append(prop["mun_token"])
        continue
    prop["obj_id"] = feature["properties"]["OBJECTID"]
    # feature id represented in the ArcGIS system
    prop["feature_id"] = feature["properties"]["LGL_ADMIN_AREA_ID"]
    # long name of the municipality
    prop["mun_name"] = feature["properties"]["ADMIN_AREA_NAME"]  
    # abbreviation of the municipality
    prop["mun_abb"] = feature["properties"]["ADMIN_AREA_ABBREVIATION"]  
    # type of the area (e.g. municipality, regional district, etc.)
    prop["feature_type"] = feature["properties"]["ADMIN_AREA_TYPE_DESC"].lower().replace(" ", "_")
    # area and length of the feature 
    prop["feature_area"] = feature["properties"]["Shape__Area"]
    prop["feature_length"] = feature["properties"]["Shape__Length"]
    feature["properties"] = prop
    accepted_features.append(feature)

geojson["features"] = accepted_features
print("skipped features: ", ", ".join(skipped_features))
print("length of skipped features: ", len(skipped_features))
print("length of features: ", len(geojson["features"]))
# saving the geojson file
with open(out_filtered_geojson_path, "w") as f:
    json.dump(geojson, f)
print("saved filtered geojson")





