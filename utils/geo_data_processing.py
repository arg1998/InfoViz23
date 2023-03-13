import pandas as pd
import geopandas as gpd
import pathlib



in_path = pathlib.Path("./Data/GeoJson/municpalities_espg3857.json").absolute()
out_geojson_path = pathlib.Path("./Data/GeoJson/municpalities_espg4326.json").absolute()

municipalities  = gpd.read_file(in_path)
# we know that the input projection is EPSG:3857 but I couldn't find a way to get it from the file
municipalities.set_crs(epsg=3857, inplace=True, allow_override=True) 
print(F"converting {municipalities.crs} projection to EPSG:4326")
# converting the pseudo-mercator ESPG:3857 projection to ESPG:4326
municipalities = municipalities.to_crs(epsg=4326)
municipalities.to_file(out_geojson_path, driver="GeoJSON")
print("done")

