# InfoViz23

Information Visualization Course ( University of Victoria - Spring 2023)

## Requirements

to run the server side code and the python script you will need:

- `openpyxl` for reading Excel (.xlsx) files
- `pandas` for data manipulation
- `fastapi` for the server application
- `uvicorn` for running and monitoring the server
- `geopandas` for reading and manipulating geospatial data

[startup.sh](startup.sh) script will install `miniconda` and creates an environment called "InfoVis23" with above packages, then creates the `$HOME/Apps/InfoVis23` directory for this repository to get cloned in.

## Bugs

- [ ] fix the `north_vancouver_city` and `langley_city` missing patches on the map (they are currently a part of the larger district in the data but not on the map)
