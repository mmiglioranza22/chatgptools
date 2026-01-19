### How I came up with this

While creating unit tests for a big project, I went with the basic `file-name.spec.ts` convention. When I realized I needed to give a specific extension for unit and integration tests to run separatedly, I faced the choice of either renaming all 70+ files manually (a 20 min job), write a bash script and hope for the best (I really should up my bash scripting game), or finally make something useful out of ChatGPT. I have not used it for anything useful before, so why not?

### Scope

The task was simple, match files by extension, change it and don't destroy anything.

From this, I reasoned:

- A python script was the most straightforward solution.
- It had to be able to take arguments (searched prefix/extension, desired prefix/extension after change) - It should ONLY do it for a given directory (eventually recursion, yet not for the first version. I wanted to keep it simple first)
- It should prompt for user input in order (so basically a "CLI" script)
- It should count and show how many files would be affected (just to be sure it was staying in a given directory) and ask for confirmation.
- Abort all if any error occurs and show it

[Check the actual prompts](https://github.com/mmiglioranza22/chatgptools/blob/main/filename_changer/prompts/file_change_prompts.txt)

### Result

The final version was pretty good and suggestions were on point. I did not continue developing the full fledgled CLI version with tests, so I can't assess if what was suggested by the model is accurate. (Homework for another time). The dry-run option was neat as well as the feature to exclude directories, and the loading spinner render itself useless being so fast it is not even required.

Use at your own expense, preferably inside a versioned controlled directory (should you make an error and just need to revert what the script did)

### Use example

#### Normal run (note that total files are affected files + script since I just threw it inside the directory to test it (you would not push the script to your repo))

![Normal run](https://github.com/mmiglioranza22/chatgptools/blob/main/filename_changer/captures/run.png)

![Dry run](https://github.com/mmiglioranza22/chatgptools/blob/main/filename_changer/captures/dry-run.png)
