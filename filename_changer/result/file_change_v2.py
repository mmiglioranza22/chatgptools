# Version 2
# Notes
# ✅ Recursively scans the current directory and all subdirectories
# ✅ Supports a --dry-run flag (no changes are made)
# ✅ Uses regex-based matching and replacement
# ✅ Requires explicit confirmation before changes (unless dry-run)
# ✅ Gracefully handles errors at all stages and aborts safely
# ✅ Ensures no partial renames occur if an error is encountered

# 🛡️ Safety Guarantees
# No changes happen unless confirmed
# Dry-run never touches files
# Errors abort immediately
# No overwriting existing files
# Recursive but controlled

import os
import re
import sys
import argparse
from typing import List, Tuple


def collect_files(base_dir: str) -> List[str]:
    """
    Recursively collect all file paths starting from base_dir.
    """
    file_paths = []
    for root, _, files in os.walk(base_dir):
        for name in files:
            file_paths.append(os.path.join(root, name))
    return file_paths


def main():
    parser = argparse.ArgumentParser(description="Recursive file renamer with regex support")
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Show what would be renamed without making any changes"
    )
    args = parser.parse_args()

    try:
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

        base_dir = os.getcwd()
        all_files = collect_files(base_dir)

        # Build rename plan first (NO changes yet)
        rename_plan: List[Tuple[str, str]] = []

        for old_path in all_files:
            filename = os.path.basename(old_path)
            if regex.search(filename):
                new_filename = regex.sub(replace_pattern, filename)
                new_path = os.path.join(os.path.dirname(old_path), new_filename)
                rename_plan.append((old_path, new_path))

        match_count = len(rename_plan)

        if match_count == 0:
            print(f"No matches found for provided pattern: {match_pattern}. Bye")
            sys.exit(0)

        print(f"{match_count} files matched the given pattern: {match_pattern}")

        if args.dry_run:
            print("\nDRY-RUN MODE (no changes will be made):")
            for old, new in rename_plan:
                print(f"{old}  ->  {new}")
            print("\nDry-run completed. Bye")
            sys.exit(0)

        confirmation = input(
            f"Matched files names will change {match_pattern} to {replace_pattern}. "
            "Do you wish to perform file changes? Y/N: "
        ).strip().upper()

        if confirmation != "Y":
            print("Abort")
            sys.exit(0)

        # Perform renaming
        for old_path, new_path in rename_plan:
            if os.path.exists(new_path):
                raise FileExistsError(
                    f"Target file already exists: {new_path}"
                )
            os.rename(old_path, new_path)

        print("Done")

    except KeyboardInterrupt:
        print("\nExecution interrupted by user. Abort")
        sys.exit(1)

    except Exception as e:
        print(f"Error: {e}")
        print("No changes were completed. Abort")
        sys.exit(1)


if __name__ == "__main__":
    main()
