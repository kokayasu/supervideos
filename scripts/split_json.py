#!/usr/bin/env python3
import json
import os


def split_json(input_file, output_dir, lines_per_file):
    # Create the output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)

    with open(input_file, "r", encoding="utf-8") as infile:
        split_index = 1
        current_lines = []

        for line in infile:
            current_lines.append(json.loads(line))

            if len(current_lines) == lines_per_file:
                output_file = os.path.join(output_dir, f"split_{split_index}.json")
                with open(output_file, "w", encoding="utf-8") as outfile:
                    for line in current_lines:
                        json.dump(line, outfile)
                        outfile.write("\n")

                current_lines = []
                split_index += 1

        # Write the remaining lines to the last split file
        if current_lines:
            output_file = os.path.join(output_dir, f"split_{split_index}.json")
            with open(output_file, "w", encoding="utf-8") as outfile:
                for line in current_lines:
                    json.dump(line, outfile)
                    outfile.write("\n")

    print(f"Split files created in {output_dir} directory.")


# Example usage:
input_file = "videos_bulk_2.json"
output_directory = "data"
lines_per_file = 10000

split_json(input_file, output_directory, lines_per_file)
