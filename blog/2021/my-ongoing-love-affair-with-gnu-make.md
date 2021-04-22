---
title: My Ongoing Love Affair With GNU Make
date: 2021-03-19
tags: automation
commentsPostId: gnu-make-love-affair
---

I've written previously about [my love for Make](/blog/2020/how-I-use-make/). The longer I use it, the more complex my desires become, and the more I learn about the awesome features (and hacks) available.

Since that previous article, my team has been using a heck of a lot of Makefiles to work on automations, and combining them with [GitHub Actions](https://github.com/features/actions) for things like testing and deployment automations. We developed some patterns, and as developers do, we started thinking about making that code reusable.

Rather than having to update 23 makefiles every time we come up with a process improvement, what if we could update 1 place and they would automatically (or at least _easily_) inherit it?! I found [an article covering exactly that](https://mattandre.ws/2016/05/makefile-inheritance/). Basically, you can add `include somefile` at the top of your makefile and it will be imported and treated as if it were already there.

Given the hammers that were already in our hands, our first approach was to create a dedicated GitHub Repo with that "base" makefile, and treat it as an npm module. We already use npm and node modules extensively, and given these two choices for import lines:

```bash
include base.Makefile
```

or

```bash
include node_modules/alumniq_devops/base.Makefile
```

**... Who cares?**

So we started down that path. Unfortunately, that's also where we hit a snag. Not _every_ one of our projects uses node.js and npm. And to have to add a package.json and require an `npm ci` step so that we can then run `make` does have a bit of a bad smell to it. And in the worst case an `npm ci` was required to get the base makefile, so that make could run, which would then need to run _another_ `npm ci`. There's a lot to like about node.js, but the speed of npm isn't really one of them.

Our next thought was to try and access the `base.Makefile` directly from `raw.githubusercontent.com`, hoping that we could use http-basic auth with an oauth token, [like you can for private git-url based npm modules](https://docs.npmjs.com/cli/v6/configuring-npm/package-json#git-urls-as-dependencies), to download the file; skipping the npm install step (and not even requiring node or npm, just curl).

Sure, we could publish the base makefile in a public repo, but we keep most of our code private, and we would prefer that this base Makefile be no different. It contains some private things like our ECR repository URL. It wouldn't be catastrophic if it were shared, but it's not something we want to volunteer, either. Keeping the file contents private is a pretty high priority.

My next thought was to try a gist, because those can be private but you only need the URL to access it, no credentials. In addition, on a complete lark, I hoped that Make would see that the file was missing and check to see if there is a target that could create it. Amazingly, this works!

```bash
include base.Makefile

base.Makefile:
	@curl https://gist.githubusercontent.com/atuttle/507151305ad440902c64df2f24145c90/raw/7ae6f3068921cd4dd77396d1541f9abef613ea9d/ -o base.Makefile 2>/dev/null
```

But this approach has its own problem: when the gist gets updated, that url doesn't go to the new revision, it's pointing directly to the old revision. The whole point of this exercise was to be able to update the base makefile and have all of the projects using it automatically get the update.

The solution I came up with isn't a full automatic-update, but it's darn close. Having recently made my own url shortener, I knew that I could create a permanent URL that would redirect to the current gist URL, and I could update it as I see fit. Of course that's not how URL shorteners are supposed to work, but nobody using this URL would _prefer_ to get the old URL, so it's fine.

```bash
include base.Makefile

base.Makefile:
	@curl https://tutt.xyz/def-not-a-fake-url -o base.Makefile 2>/dev/null
```

I tried to add the `curl` command to the root of the file, but you can't have commands there (other than include?), so that doesn't work.

So you might be asking yourself what about updates? One of the targets in `base.Makefile` is:

```bash
update:
	@curl https://tutt.xyz/def-not-a-fake-url -o base.Makefile 2>/dev/null
```

## Holy Inheritance, Batman!

The _other_ awesome thing I learned about Makefiles this week was an _even better_ approach to overriding targets. Much of the initial work on figuring out these details was done by my teammate Adam Crump, so, thanks Adam!

If you start with a `base.Makefile`:

```bash
foo:
	@echo "parent-foo"
```

And this is your `Makefile`:

```bash
include base.Makefile

foo:
	@echo "child-foo"
```

If you run `$ make foo` then you can see here that it works, but you get some unsightly warnings:

```
Makefile:4: warning: overriding commands for target `foo'
base.Makefile:2: warning: ignoring old commands for target `foo'
child-foo
```

It turns out, there's a [neat hack](https://stackoverflow.com/a/49804748/751) to make those warnings go away, and it also allows you to call the version from the base makefile from the child, if you happened to want to. For example, you might want to run an `npm ci` before you call the target.

At the bottom of your `base.Makefile`, add this:

```bash
%: %-super
	@  true
```

Basically this is a wildcard match. If no other targets match the requested target, then the wildcard target runs, and it depends on the target of the same name with the `-super` suffix.

So... then add the suffix: `-super` to all of the targets in your `base.Makefile`:

```bash
foo-super:
	@echo "parent-foo"

bar-super:
	@echo "parent-bar"

baz-super:
	@echo "parent-baz"

%: %-super
	@  true
```

And if you want to override one, but then also run the original implementation, you can call it directly with the `make target-super` full name. So in this example, `make bar` will also call `make bar-super`:

```bash
include base.Makefile

foo:
	@echo "child-foo"

bar:
	@echo "child-bar"
	@make bar-super
```

And now, you can run all three of these targets (`foo`, `bar`, and `baz`) with no warnings. Note that `baz` is NOT overridden, and only exists with the `-super` prefix, but I can still run it with the command `make baz`

```
$ make foo
child-foo

$ make bar
child-bar
parent-bar

$ make baz
parent-baz
```

I'm super excited about the possibilities this opens up for my team.
