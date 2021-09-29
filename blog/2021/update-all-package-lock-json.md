---
title: 'CLI Tip: Update package-lock.json files when their package.json changes'
tags:
  - cli
  - 'quick-tip'
---

That's a mouthful of a title, so first let me drop the command for easy copy/paste action, then I'll break down why you might want to do this, and what each piped command is doing.

```bash
git status -sb | grep package.json | awk '{print $2}' | sed "s/package.json//" | xargs -I{} echo "cd `pwd`/{} && npm i" | sh
```

Some projects have several, nay, many package.json files for a variety of services and sub-projects. Now suppose that you have a dependency that many of them share, and you need to update them all to be aware of that new dependency. Regex find-and-replace in your IDE makes quick work of the `package.json` changes, but in order for those to take effect you also need to update each associated `package-lock.json`.

\*nix command line to the rescue!

```bash
git status -sb
```

> pro-tip: this is my preferred way to use git status. It's more terse and information dense, and I have it aliased to `git st`.

This command prints out the status of our git repo. Since we modified a bunch of `package.json` files, they are included in the list.

```bash
grep package.json
```

Here we're using `grep` to filter the git status listing to only the lines that contain a reference to package.json somewhere

```bash
awk '{print $2}'
```

This uses the `awk` utility to keep only the 2nd column of text (space-delimited columns) from each line.

```bash
sed "s/package.json//"
```

Then we use `sed` to do a find and replace to keep the folder path but delete the text `package.json`.

We're almost there!

If you run everything up to this point, you'll see a list of folders containing a modified package.json:

```bash
$ git status -sb | grep package.json | awk '{print $2}' | sed "s/package.json//"
folder/one/
folder/two/
other/folder/
yet/another/folder/
```

This just leaves running a command in each folder. We need to change directory into each folder and run the command `npm i`. The CLI utility `xargs` takes multi-line input and will run your command once for each line of input.

```bash
xargs -I{} echo "cd `pwd`/{} && npm i" | sh
```

I cheated, that's two commands. This is some fairly advanced usage of `xargs`, and what we're really doing is generating a dynamic command (in the string being echoed) and piping that into `sh` which is the shell command.

The `-I{}` segment indicates we're doing a string replace and that xargs should replace all instances of `{}` with the input text. We also need the full path since we're passing this off to a new shell for execution, so we use `pwd` to drop the current directory (the root of our monorepo) into the command. If you run all of the above without the final `| sh` then you'll see the final commands that would run:

```bash
$ git status -sb | grep package.json | awk '{print $2}' | sed "s/package.json//" | xargs -I{} echo "cd `pwd`/{} && npm i"
cd /project/root/folder/one/ && npm i
cd /project/root/folder/two/ && npm i
cd /project/root/other/folder/ && npm i
cd /project/root/yet/another/folder/ && npm i
```

Now add the `| sh` back on the end, and each command gets executed instead of echoed.

[monorepos]: https://semaphoreci.com/blog/what-is-monorepo
