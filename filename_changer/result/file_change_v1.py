# Version 1
# Notes
# no dry-run
# no recursion
# Uses regex, so patterns like \.dto\.spec\.ts$ are supported.
# Will not overwrite existing files—it skips and warns instead.
# Works only on files in the current directory, not subdirectories (by design).

import os
import re
import sys

def main():
    # Prompt user for patterns
    match_pattern = input("Enter the regex pattern to match file names: ").strip()
    if not match_pattern:
        print("Empty pattern provided. Bye")
        sys.exit(0)

    replace_pattern = input("Enter the replacement string: ").strip()

    try:
        regex = re.compile(match_pattern)
    except re.error as e:
        print(f"Invalid regex pattern: {e}")
        sys.exit(1)

    # List all files in current directory
    files = [f for f in os.listdir('.') if os.path.isfile(f)]

    # Find matching files
    matched_files = [f for f in files if regex.search(f)]

    match_count = len(matched_files)

    # Print match summary
    if match_count == 0:
        print(f"No matches found for provided pattern: {match_pattern}. Bye")
        sys.exit(0)

    print(f"{match_count} files matched the given pattern: {match_pattern}")

    # Confirmation prompt
    confirmation = input(
        f"Matched files names will change {match_pattern} to {replace_pattern}. "
        "Do you wish to perform file changes? Y/N: "
    ).strip().upper()

    if confirmation != "Y":
        print("Abort")
        sys.exit(0)

    # Perform renaming
    for old_name in matched_files:
        new_name = regex.sub(replace_pattern, old_name)

        # Avoid overwriting existing files
        if os.path.exists(new_name):
            print(f"Skipping '{old_name}' -> '{new_name}' (target already exists)")
            continue

        os.rename(old_name, new_name)

    print("Done")


if __name__ == "__main__":
    main()
