#!/bin/bash

# Check if the `infovis23_session` session is already running
if screen -ls | grep -q "infovis23_session"; then
    # If it is, kill the session
    screen -X -S infovis23_session quit
    echo "Existing session killed."
fi

# Start a new `screen` session with the name "infovis23_session"
screen -S infovis23_session -d -m

# Attach to the `infovis23_session` session and run the `uvicorn` command
screen -r infovis23_session -X stuff 'cd Apps/InfoViz23/server/ && uvicorn server:app --reload --host 0.0.0.0 --port 8085'

# Detach from the `infovis23_session` session
screen -d infovis23_session

# Wait for the `uvicorn` process to finish
# while [ -n "$(ps -ef | grep uvicorn | grep -v grep)" ]; do
#     sleep 1
# done

# Print "Server is up"
echo "Server is up."

# Exit the script
exit 0
