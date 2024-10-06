#!/bin/bash

Check if Python 3.10 is installed
if ! command -v python3.10 &> /dev/null
then
echo "Python 3.10 could not be found. Please install Python 3.10 to continue."
exit
fi

Create a virtual environment using Python 3.10
python3.10 -m venv env_game_server

Activate the virtual environment
source env_game_server/bin/activate

Upgrade pip to the latest version
pip install --upgrade pip

Install the required packages from requirements.txt
pip install -r requirements.txt

Notify the user that the setup is complete
echo "Virtual environment setup complete. To activate it, run 'source env_game_server/bin/activate'."