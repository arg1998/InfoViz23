
# BC Traffic Accidents Visualizer
[https://github.com/arg1998/InfoViz23/raw/refs/heads/main/Data/demo.mp4
https://user-images.githubusercontent.com/6877923/115474571-03c75800-a23e-11eb-8096-8973aad5fa9f.mp4](https://private-user-images.githubusercontent.com/19180964/430199261-b37412a4-20ff-4caf-ac51-b64a1dd97636.mp4)

BC Traffic Accidents Visualizer is an interactive web application that helps users explore traffic accident data in British Columbia by municipality, year, and contributing factors. By combining dynamic maps and rich Sankey diagrams, this tool offers an intuitive and visual way to understand how accident causes vary across locations and time. 
> 🏫 This project was developed as part of the Information Visualization course at the University of Victoria (Spring 2023).


> [!caution]
> This project is no longer publicly accessible. The live demo has been shut down due to being unable to afford hosting costs and ongoing maintenance.


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
