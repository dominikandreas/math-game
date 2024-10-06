import re
import os
import argparse  # For command-line argument parsing

def update_files(filepath):
    """Updates project files based on the provided file content."""

    file_pattern = r"===== START OF FILE: (.+) =====\n([\s\S]+?)\n===== END OF FILE: \1 ====="

    try:
        with open(filepath, "r") as f:
            update_data = f.read()
    except FileNotFoundError:
        print(f"Error: Input file not found - {filepath}")
        return

    for match in re.finditer(file_pattern, update_data):
        filepath = match.group(1)
        new_content = match.group(2)

        try:
            dirname = os.path.dirname(filepath)
            if dirname and not os.path.exists(dirname):
                os.makedirs(dirname)

            with open(filepath, "w") as f:
                f.write(new_content)
            print(f"Updated: {filepath}")

        except OSError as e:
            print(f"Error creating directory for {filepath}: {e}")
        except Exception as e:
            print(f"Error updating {filepath}: {e}")



if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Update project files from an extracted file.")
    parser.add_argument("input_file", help="Path to the extracted file")
    args = parser.parse_args()

    update_files(args.input_file)