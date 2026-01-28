---
title: 'My RALPH Workflow for Claude Code'
desc: 'My scripts and how I use them, as of January 2026.'
img: /img/2026/ralph.avif
date: 2026-01-27 08:00:00
tags:
  - ai
  - claude
  - automation
  - productivity
---

This is somewhat close to the bleeding edge of how LLM's are being used to code right now, so I don't expect this to be relevant for very long, but I needed to be able to share my notes, so here you go.

![Ralph Wiggum, tireless junior software engineer](/img/2026/ralph.avif)

Source: Shamelessly stolen from <a href="https://venturebeat.com/technology/how-ralph-wiggum-went-from-the-simpsons-to-the-biggest-name-in-ai-right-now">VentureBeat (who generated it using Nano Banana Pro on Fal.ai)</a>{class="photo-byline"}

## What is RALPH?

The super, super short version: it's a technique for running Claude Code, headlessly, in a for loop, which has some nice advantages. If you love video tutorials as much as I do, watch [Matt Pococks primer video on RALPH][matt]. We also discussed this somewhat extensively on Episode 246 (coming soon!) of the [Working Code Podcast][wcp].

**It's worth noting:** RALPH is probably not worth using on a Claude Pro subscription. It's going to chew through your credits quickly. Even on the $100/month plan, if I'm being particularly productive, I have run out of quota with about an hour remaining in my (5-hour) session window.

## Setup

First, add `~/.bin` to your `$PATH` if you haven't already. Then create three executable scripts in that directory: `plan`, `ralph`, and `ralph-install`. You'll also need a `~/.ralph/` directory to store your template files.

Here's the basic structure:

```bash
~/.bin/
├── plan               # Starts planning sessions
├── ralph              # Runs iterative development cycles
└── ralph-install      # Sets up .ralph directory in your project

~/.ralph/
├── prd.example.json   # PRD template
└── progress.md        # Example progress document
```

You don't technically need the `ralph` script, it just executes the `./.ralph/ralph.sh` script, but who wants to type `./.ralph/ralph.sh` when you can just type `ralph`?

### The Files

**~/.bin/plan**

```bash
#!/bin/bash

if [ $# -eq 0 ]; then
	echo "Usage: plan <feature description>"
	exit 1
fi

claude "Study .ralph/prd.example.json and, if it exists, .ralph/prd.json.
Help me plan changes to my project. First give me an opportunity to brain-dump my thoughts, and then when I ask if you
have any questions, ask relevant/clarifying questions to better understand the problem/solution and then add the result to .ralph/prd.json.
The change we're planning is: $*"
```

**~/.bin/ralph**

```bash
sh ./.ralph/ralph.sh "$@"
```

**~/.bin/ralph-install**

```bash
#!/usr/bin/env bash

echo "Adding ralph-scripts to git ignore"
echo "" >> .gitignore # a blank line
echo ".ralph" >> .gitignore

echo "Setting up .ralph directory"
mkdir -p ./.ralph
cp ~/.ralph/ralph.sh ./.ralph/ralph.sh
cp ~/.ralph/prd.example.json ./.ralph/prd.example.json
cp ~/.ralph/progress.md ./.ralph/progress.md

echo "Install complete"
echo "--------------------------------"
echo "Customize this project's ralph script at .ralph/ralph.sh"
echo "--------------------------------"
echo "Usage: plan \"name of feature\""
echo "Usage: ralph <iterations>"
```

**~/.ralph/prd.example.json**

```json
[
	{
		"category": "ui",
		"description": "some ui feature",
		"steps": ["step 1", "step 2"],
		"passes": false
	}
]
```

**~/.ralph/progress.md**

```md
# Progress Log

## (current date in yyyy-mm-dd)

Summary of lessons learned and work done.
```

## The Workflow

### Step 1: Make (or add to) your plan

When you're ready to start a new feature, run:

```bash
plan "Add user authentication with OAuth2 support"
```

This kicks off a planning session where you brain-dump your requirements and Claude asks clarifying questions. The goal is to produce a solid PRD that captures everything Claude needs to know to implement the feature autonomously.

You do not have to get it all written down in one prompt. Your thoughts do not need to be well organized. Claude will organize them for you. The prompt built in to the plan command tells claude to assume you're going to send in another prompt with more details, and another, and another, until you tell it you're done. Take as many as you need. Take breaks to think about it.

I've taken to using dictation software to avoid typing out really long prompts. However, it is really helpful to mention specific paths/files that are relevant, so sometimes you have to adjust the output from your dictation. Still worth it.

### Step 2: Get to work

Once your PRD is ready, run:

```bash
ralph 42
```

The number specifies the maximum iterations Claude should run. Each iteration involves Claude reviewing the current state, making progress on the implementation, and documenting what was done. With the prompt I've provided, it will commit at the end of each iteration.

### Step 3: Interrupts

I am specifically AVOIDING using the `--dangerously-skip-permissions` flag (aka "YOLO mode") in this workflow because [it's not safe](https://www.oreateai.com/blog/the-perils-of-ai-lessons-from-claudes-catastrophic-command/57b40b0e31d227754d636d1d0a82ee2b). Instead, my prompts indicate that if extra permissions are needed to accomplish the task, claude should print what that new permission is, and exit.

Since we're not running in YOLO mode, by default claude has very little permission to do anything other than read and write files in the project directory. You provide it additional permissions by specifying them in the file `<project-root>/.claude/settings.local.json`.

This is a subset of the permissions I've granted in the project where I do most of my RALPHing.

```json
{
	"permissions": {
		"allow": [
			"Bash(pnpm exec playwright test:*)",
			"Bash(pnpm check)",
			"Bash(pnpm run check*)",
			"Bash(pnpm run test*)",
			"Bash(pnpm exec vitest*)",
			"Bash(pnpm exec playwright*)",
			"Bash(pnpm vitest*)",
			"Bash(pnpm test)",
			"Bash(pnpm test:*)",
			"Bash(pnpx tsc *)",
			"Bash(git add*)",
			"Bash(git commit*)",
			"Bash(git commit -S *)",
			"Bash(git commit -S -m *)",
			"Bash(git status*)",
			"Bash(git diff*)",
			"Bash(git log*)",
			"Bash(git commit:*)",
			"Bash(cp -R*)",
			"Bash(cp -r*)",
			"Bash(rsync -a *)"
		]
	}
}
```

If Claude gets stuck or needs input, it'll tell you what it needs and exit.

Then you decide whether or not to allow it. If you do want to allow it, add the requested permission to your settings.local.json file. Then run `claude --continue` to resume the session. Tell claude, "I granted that permission. keep going." It will pick right back up where it left off (it just won't continue the for-loop).

I haven't tried it, but I bet you could run: `claude --continue -p "I granted that permission. keep going." && ralph 5`. In theory, it should pick up the previous session, finish what it was doing, and then when it exits, start a new ralph loop with a max remaining iterations of (in this case) 5.

## Progress Tracking

The `progress.md` file serves as a running log of work completed and lessons learned during each iteration. Despite `ralph-install` blocking the whole `.ralph` directory in `.gitignore`, I am currently allowing RALPH to commit both the PRD and the progress.md file in my feature branch. I like the idea of being able to roll back, and when I'm done I can just delete those files and squash the branch and it's like they were never there.

If you're not sure why/how ralph accomplished something, it's probably in progress.md. You could read it (_like a chump_) or you could tell claude to read it and then ask claude to explain itself to you.

[wcp]: https://workingcode.dev
[matt]: https://www.youtube.com/watch?v=example
