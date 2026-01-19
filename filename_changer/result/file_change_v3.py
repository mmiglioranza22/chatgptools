# Version 3
# ✅ What’s included
# 🔁 Recursive scan of current directory and subdirectories
# 🚫 Exclude directories (validated before execution)
# 🧪 Dry-run mode (--dry-run)
# ⏳ Loading animation (spinner) during rename operations
# ↩️ Rollback support — if interrupted or error occurs, all renames are reverted
# 🛑 Graceful error handling (including Ctrl+C)
# 🔐 No partial changes are persisted

import os
import re
import sys
import argparse
import threading
import time
from typing import List, Tuple


# ---------------- Spinner ---------------- #

def spinner(stop_event: threading.Event):
    symbols = ["|", "/", "-", "\\"]
    i = 0
    while not stop_event.is_set():
        print(f"\rRenaming files... {symbols[i % len(symbols)]}", end="", flush=True)
        time.sleep(0.1)
        i += 1
    print("\r", end="", flush=True)


# ---------------- Utilities ---------------- #

def collect_files(base_dir: str, excluded_dirs: List[str]) -> List[str]:
    collected = []
    excluded_abs = {os.path.abspath(d) for d in excluded_dirs}

    for root, dirs, files in os.walk(base_dir):
        root_abs = os.path.abspath(root)

        # Skip excluded directories
        if any(root_abs == ex or root_abs.startswith(ex + os.sep) for ex in excluded_abs):
            dirs[:] = []
            continue

        for name in files:
            collected.append(os.path.join(root, name))

    return collected


def rollback(renamed: List[Tuple[str, str]]):
    for new_path, old_path in reversed(renamed):
        if os.path.exists(new_path):
            os.rename(new_path, old_path)


# ---------------- Main ---------------- #

def main():
    parser = argparse.ArgumentParser(description="Recursive regex-based file renamer")
    parser.add_argument("--dry-run", action="store_true", help="Preview changes without renaming files")
    args = parser.parse_args()

    renamed_files: List[Tuple[str, str]] = []
    stop_spinner = threading.Event()
    spinner_thread = None

    try:
        # ---- Excluded directories ----
        exclude_input = input(
            "Enter directories to exclude (comma-separated, leave empty for none): "
        ).strip()

        excluded_dirs = []
        if exclude_input:
            excluded_dirs = [d.strip() for d in exclude_input.split(",") if d.strip()]
            print("Excluded directories:")
            for d in excluded_dirs:
                print(f" - {d}")

            for d in excluded_dirs:
                if not os.path.isdir(d):
                    print(f"Excluded directory does not exist: {d}")
                    print("Abort")
                    sys.exit(1)

        # ---- Patterns ----
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

        # ---- Collect files ----
        base_dir = os.getcwd()
        all_files = collect_files(base_dir, excluded_dirs)

        rename_plan: List[Tuple[str, str]] = []

        for old_path in all_files:
            filename = os.path.basename(old_path)
            if regex.search(filename):
                new_filename = regex.sub(replace_pattern, filename)
                new_path = os.path.join(os.path.dirname(old_path), new_filename)
                rename_plan.append((old_path, new_path))

        if not rename_plan:
            print(f"No matches found for provided pattern: {match_pattern}. Bye")
            sys.exit(0)

        print(f"{len(rename_plan)} files matched the given pattern: {match_pattern}")

        # ---- Dry-run ----
        if args.dry_run:
            print("\nDRY-RUN MODE:")
            for old, new in rename_plan:
                print(f"{old} -> {new}")
            print("\nDry-run completed. Bye")
            sys.exit(0)

        # ---- Confirmation ----
        confirm = input(
            f"Matched files names will change {match_pattern} to {replace_pattern}. "
            "Do you wish to perform file changes? Y/N: "
        ).strip().upper()

        if confirm != "Y":
            print("Abort")
            sys.exit(0)

        # ---- Spinner start ----
        spinner_thread = threading.Thread(target=spinner, args=(stop_spinner,))
        spinner_thread.start()

        # ---- Rename with rollback tracking ----
        for old_path, new_path in rename_plan:
            if os.path.exists(new_path):
                raise FileExistsError(f"Target file already exists: {new_path}")

            os.rename(old_path, new_path)
            renamed_files.append((new_path, old_path))

        stop_spinner.set()
        spinner_thread.join()
        print("Done")

    except KeyboardInterrupt:
        stop_spinner.set()
        if spinner_thread:
            spinner_thread.join()
        print("\nInterrupted by user. Rolling back changes...")
        rollback(renamed_files)
        print("Rollback completed. Abort")

    except Exception as e:
        stop_spinner.set()
        if spinner_thread:
            spinner_thread.join()
        print(f"\nError: {e}")
        print("Rolling back changes...")
        rollback(renamed_files)
        print("Rollback completed. Abort")

    finally:
        stop_spinner.set()


if __name__ == "__main__":
    main()
