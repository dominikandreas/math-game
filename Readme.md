# Math Game

This is a simple demonstrator for a math game which is at the time of writing 100% AI generated. 

This works by extracting the code into a file (see extract_project_files.sh), posting it to an AI and asking it to 
make changes. The results of the AI can then again be imported (see update_files.py).

## Getting started.

To get started, please make sure that you have python3 installed (any version >= 3.8 should probably work).

Then execute `setup.sh` to create the python virtual environment with all the requirements. You can then run
the app via `run.sh`.

## Making changes

First extract the files via `extract_project_files.sh` which will create a text file.

Copy the contents of the text file into your favourite AI and follow up with a prompt such as:

> This is my math game. I would like you to make the following adjustments:
>
> ...
> 
> Please use the same format as the one given above, ommitting the files that don't require any changes. You can also add new files if necessary.

Copy the results into a file and run `update_files.py <path to file>` to apply the changes to the code. 

It is of course also possible to make manual changes. So far this hasn't been necessary.

## Recommendations

I recommend to use either google ai studio with gemini 1.5 pro (latest version) or similar (the aistudio is free to use). Using all files as input, it is important to have a large context length.