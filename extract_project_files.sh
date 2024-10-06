#!/bin/bash

# Define the project directory
PROJECT_DIR="$(pwd)"

# Define the output file
CURRENT_DATETIME=$(date +"%Y-%m-%d_%H-%M-%S")
OUTPUT_FILE="project_files_extracted_$CURRENT_DATETIME.txt"

# Remove existing output file if it exists
if [ -f "$OUTPUT_FILE" ]; then
  rm "$OUTPUT_FILE"
fi

# File extensions to extract
EXTENSIONS=(".py" ".html" ".js" ".json" ".sh")

# Extract content of relevant files
for EXT in "${EXTENSIONS[@]}"; do
  find "$PROJECT_DIR" -type f -name "*$EXT" -not -path "$PROJECT_DIR/env_game_server/*" | while read -r FILE; do
    echo "===== START OF FILE: $FILE =====" >> "$OUTPUT_FILE"
    cat "$FILE" >> "$OUTPUT_FILE"
    echo -e "\n===== END OF FILE: $FILE =====\n" >> "$OUTPUT_FILE"
  done
done

echo "All relevant files have been extracted to $OUTPUT_FILE."