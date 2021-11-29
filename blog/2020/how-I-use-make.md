---
title: How I Use Make to Automate My Development Environment
desc: This is probably crazy and inadvisable. Which is part of what makes it fun!
img: /img/2020/kevin-ku-w7ZyuGYNpRQ-unsplash.jpg
date: 2020-09-21
tags:
  - automation
---

![A blurry computer screen in the background, and eyeglasses in the foreground, through which the computer screen is in focus](/img/2020/kevin-ku-w7ZyuGYNpRQ-unsplash.jpg)

Photo by <a href="https://unsplash.com/@ikukevk?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Kevin Ku</a> on <a href="https://unsplash.com/s/photos/hacker?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>{class="photo-byline"}

I don't know if this is brilliant or boneheaded, but it works reasonably well for me, so I thought I'd share.

A long time ago I saw my friend (and super smart dude) [Mark Mandel](https://twitter.com/neurotic) use Make as a way to store command aliases within a project. Maybe that sentence needs some explanation.

## Aliasing CLI Commands

The command line interface (CLI) can be an incredibly powerful environment, but to fully use that power you might need to string together an incredibly long command. For example, after a `git merge` you'll sometimes have merge conflicts. Here's a command that will open them all in VSCode for editing:

```shell
git status -sb | grep UU | awk '{print $2}' | grep -v '\.min\.' | xargs code
```

This is several commands chained together:

1. `git status -sb` Gets a list of files from git that are in a modified state
1. `grep UU` Excludes anything that's not conflicted -- `git status -sb` prefixes conflicted files with `UU`
1. `awk '{print $2}'` prints the 2nd column (space-delimited) from the line, so just the filename
1. `grep -v '\.min\.'` excludes minified files (e.g. JavaScript builds), because a build fixes those.
1. `xargs code` runs the `code` command for each line of input, in this case a conflicted file.

But there's no way in hell I'm going to remember all of that, let alone type it all out perfectly, every time I have merge conflicts... and that's only just scratching the surface of the universe of long and complex CLI commands.

So I have this saved as an alias in my `.zshrc` file:

```shell
alias conflicts="git status -sb | grep UU | awk '{print $2}' | grep -v '\.min\.' | xargs code"
```

That's great for things that are personal to me. This `conflicts` command is something I use, and it's identical for every project.

On the other hand, not all commands are identical between all projects. For example, if you're using Docker to build a local development environment that functions like your production environment, the containers and the commands to compose them together are going to differ from project to project; so having that alias live in my profile doesn't make as much sense. I'll need new aliases for every project, and keeping them in sync with the way the environment works is difficult. It would be great if there were a way to commit them to source control. 🤔

And bonus: making it part of the code repository means it's shared across the team and all team members can benefit from it.

> Obviously there's [Docker-Compose](https://docs.docker.com/compose/), but that will _only_ compose a local development environment. This Makefile approach is useful beyond that and actually pairs well with Docker Compose. We use compose to compose a collection of containers as our local development environment, but we have a Makefile that we use to build and publish production containers to Amazon ECR, and deploy them on Amazon ECS, and Docker Compose can't do that. It also won't automate the little things like attaching to a shell session inside your Nginx container.

## A Make Primer

This isn't going to be an article on the intricacies of Make and Makefiles ([learn more here](https://www.gnu.org/software/make/manual/html_node/index.html)), but here's a quick Make primer.

I learned about it in my early programming classes as a tool that we could use to orchestrate compiling our C and C++ programs. It allows you to create "targets" (think scripts) that have a sequential list of commands to run, but they can also optionally depend on other targets _and on files_.

If compiling your program required a certain object (`foo.o`) file that itself had to be compiled, you could simply depend on that file `foo.o` and Make would build it for you if the file doesn't exist. How does it build that file? You create a target with the same name: `foo.o`.

```makefile
myapp: foo.o #depends on foo.o
	# building myapp executable
	cc -o myapp myapp.c

foo.o:
	# building foo.o from foo.c
	cc -o foo.o foo.c
```

You run `make myapp` and when all is said and done, your app should be compiled...

Make is super powerful, and writing this post reminded me that one of the few books I kept from college was [Linux in a Nutshell](https://amzn.to/3ccrtJp), which is kind of like the manpages of all of the most common Linux tools in printed form for quick reference, but a little better. I checked, and mine (_3rd edition, printed August 2000! I'm so old!_) does have a section on Make. A quick skim showed me a few things that I'm eager to learn more about, so I popped a bookmark in and left it on my desk to come back to later. (Narrator: He won't.)

## Sharing aliases and workflows with Makefiles

Cool, so now we understand the power of aliases to simplify complex commands and give them short and easily remembered names; and we're eager to share commands with our teammates. How can Make help with that?

Let's start with the goal of running a docker container, and building it first if necessary. We'll aim to use the command `make up` to start our environment.

```makefile
up:
	docker run myapp

build:
	docker build -t myapp .
```

I've defined one target to start the container and one target to build it, but there's no dependency between them. How do you depend on something that doesn't create a physical artifact in Make? Well, I don't know if this is a good idea or not but I've had some success using hidden files to indicate things like build status:

```makefile
up: .myapp-built
	docker start myapp

build: .myapp-built
	@echo Container built.

.myapp-built:
	docker build -t myapp . && touch .myapp-built
```

Here I'm using a hidden file `.myapp-built` to indicate that the container has been built. If I were to add a shortcut to delete the container for some reason, it should also delete that file to indicate to Make that the container doesn't exist any more. You'll also want to add `.myapp-built` to `.gitignore`.

Here's a slightly more thorough example showing targets to start, stop, build, and rebuild your container.

```makefile
up: .myapp-built
	@docker run --rm -d myapp && touch .myapp-running

down: .myapp-running
	-docker stop myapp
	@rm -f .myapp-running

build: .myapp-built
	@echo Container built.

rebuild:
	@make down
	@rm -f .myapp-built
	@make build

.myapp-running:
	#if you try to run `make down` when container isn't running, you'll be here
	@touch .myapp-running

.myapp-built:
	@docker build -t myapp . && touch .myapp-built
```

## What's up with the @ and - prefixes?

Given:

```makefile
hello:
	echo Hello, world.
```

If you run: `make hello`, the output will be:

```
echo Hello, world.
Hello, world.
```

Prefixing a command, such as `echo` with an `@` tells Make not to print the command to the output. With the same example as above, if we changed `echo` to `@echo`, the output would be:

```
Hello, world.
```

The `-` prefix tells Make to ignore any errors that command might throw. For example, if you try to stop a container that's not running, Docker will throw an error. Normally Make would stop executing because of the error. But since we just want to make sure that it's not running and we don't care if it was already not running, we can ignore that error.

## Is there a better way?

This is the best way I've found to share automation shortcuts with my team. We've also used npm scripts to do similar work in the past, but I feel like they aren't quite as robust. Since they have to go into package.json, you end up having to jump through some hoops to make them work as one-liners that can live in a JSON string, and there's no baked-in dependency resolution.

I don't love that we have a bunch of `.dotfiles` hanging around to indicate automation statuses, but that's kind of the only drawback I've seen so far, and it's a small enough price to pay.

I don't know how well Make works on Windows, and of course it's going to require WSL, but hopefully developer machines are all on recent enough versions Windows to have WSL by now. 🤷‍♂️

If you have any better ideas, I'd love to hear them.
