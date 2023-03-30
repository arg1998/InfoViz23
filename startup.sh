#!/bin/bash

# Install Miniconda
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O miniconda.sh
bash miniconda.sh -b -p $HOME/miniconda
rm miniconda.sh

# Add Miniconda to PATH
echo 'export PATH="$HOME/miniconda/bin:$PATH"' >> $HOME/.bashrc
source $HOME/.bashrc

# Create the InfoVis23 environment
conda create -y --name InfoVis23

# Activate the environmentasdasd
source activate InfoVis23

# Install packages with pip
pip install openpyxl pandas fastapi uvicorn geopandas

