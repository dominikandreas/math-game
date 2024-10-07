#!/bin/bash

# Activate the virtual environment
source env_game_server/bin/activate

# Run the FastAPI server using uvicorn
uvicorn main:app --reload --host 0.0.0.0 --port 43552