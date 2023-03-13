# Reports

Here we will report our data exploration:

- Using [geo_data_processing.py](./utils/geo_data_processing.py) script, we transformed the [Pseudo-Mercator(ESPG3857)](./Data/GeoJson/municpalities_espg3857.json) projection to [World-Mercator(ESPG4326)](./Data/GeoJson/municpalities_espg4326.json). We only had access to Pseudo-Mercator (or Web-Mercator) projection data.
- There are 743 unique municipalities in the ICBC dataset while we have 160 in the GeoJson file. Intersection of these two sets are 151 municipalities.
- After applying municipality intersection on the original dataset with 139617 rows, only 124930 rows remained. 14687 rows were removed after matching with GeoJson data (10.5% reduction in the number of data points).
- We used the [municipality_match.py](./utils/municipality_match.py) script to generate a well-formed and clean dataset of ICBC
- These tokenized municipalities were not found in the ICBC dataset: `hudson's_hope, daajing_giids, valemont, nrrm, kent, langley_-_city, north_vancouver_-_city, silverton, north_cowichan`. Note that `north_vancouver_-_city` and `langley_-_city` are omitted because they were included in `north_vancouver` and `langley` districts.
- We used 5 colors that are recognizable by all types of color-blindness [Reference](https://davidmathlogic.com/colorblind/#%23D81B1B-%231ECEE5-%23FFC107-%2300334D-%23EC00FF)
  