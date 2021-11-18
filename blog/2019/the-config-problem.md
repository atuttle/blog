---
title: The Config Problem
desc: What's a good way to share configuration between microservices and monoliths?
img: /img/2019/paul-hanaoka-GkwsToy2jRk-unsplash.jpg
date: 2019-12-18
tags:
  - config
---

Architecture discussion time!

Our primary product started its life as a monolith, and as features started to outgrow the capabilities of our monolithic stack we fractured them off as microservices. To my mind, this sounds like two gold-plated best practices exercised well:

1. Make it work, then make it good, then make it fast.
1. Avoid premature optimization.

In an attempt to be pragmatic, the original solution I came up with for managing configuration was to hard-code it all into a data structure in a class. (_"We can improve it later when it becomes a problem!" Sometimes I want to punch prior me in the mouth..._) Since we were writing CFML it became known as `config.cfc`. Using a framework with great support for Dependency Injection made it easy to pull that config class into any controller or service throughout the app.

It's not super important to the story but it provides context for what comes next: We host that monolithic app on an AWS EC2 instance.

When certain scheduled tasks started to bring the rest of the application to its knees, the first thing we did was to bring up a 2nd server to run background tasks. That way if a scheduled task brought everything grinding to a halt (again), users wouldn't be affected. No config problem here. There's two copies of `config.cfc`, but they're both checked out of the same repository and unchanged, so there's nothing to worry about.

Then things got hectic. Some features got good enough that they became mission critical to our customers, and their demands for speed and throughput were simply more than our stack could handle, even with a server dedicated to running background tasks.

## To the cloud!

![To the cloud!](/img/2019/to-the-cloud.jpg)

Since we knew we had created a valuable tool but it couldn't keep up with demand, we knew it was time to optimize its performance. We did that thing you're not supposed to do: We gathered the entire team in one physical location, locked ourselves in a room, and coded and talked about code until our eyes and our ears and our brains hurt, slept a few hours, and then got right back to it. Repeat until success or failure. I wish I could tell you that in that moment we somehow magically had the type of work-life balance that everyone dreams of and still managed to solve our problems fast enough.

Nope.

We did the unhealthy thing. The "hero" thing. And I can't recommend it.

But it worked.

When we came out of that weekend we had a set of microservices that were capable of being several orders of magnitude faster than what the old monolith could pull off. In fact it was so fast that we had to add artificial limits to prevent the jobs from choking the database to death or exceeding an entire hour's api rate limit in the first 5 minutes; and even with those artificial limits the new processes were still 2+ orders of magnitude faster.

But herein lies the rub.

The new processes run on AWS Lambda, running Node.js. Node can't (or at the very least, shouldn't!) handle cfc files, so what we did at that time was to duplicate our configuration and create a node module that mostly works the same way that `config.cfc` does. You require our node module and get back some functions that allow you to pull out any setting you want.

## Problem #1

Keeping these two parallel configs in lock-step has not been easy; but it's been several years and we've instilled a decent routine that keeps us mostly on top of this problem.

Ideally we would have only one source of configuration-truth, and all applications could consume it.

The natural choice here would seem to be JSON, not least because the native data structures we've used to this point in the CFC and the node module heavily resemble JSON. If we could figure out the logistics, any app we've got could easily parse a JSON file at startup to load the config into memory.

Ah, but the logistics. Let's start with the simple solution and see where it falls over.

Why not add a `package.json` and npm-install our node config module into our CFML app, reading it at app startup?

That much is fine, but now every time we need to make a configuratoin change we have to follow all of these steps in the right order:

- Make the config change in the node config module repo
- Tag and push a new release of the config (PR with code review and approval process)
- Update the dependency in our CFML app's package.json to require the new config module version
- Tag and push a new release of the app (PR with code review and approval process)
- Deploy the app changes, including manually updating dependencies after app deploy

Yes, it's true, we don't have any deploy automation yet. It's on our short list of projects to get to sooner rather than later and the groundwork is already in progress, but for the moment we still deploy manually.

_Yes, it does feel like the web development equivalent of banging rocks together. Thanks for asking._

And all of that only covers the monolithic core app. What about our microservices?

## Problem #2

Our microservices are mostly Lambda functions, which are a snapshot in time. Just deploying a new version of the config doesn't mean the Lambda functions will start using it. We currently have to:

- Update the dependencies in our Lambda functions' package.json files to require the new config module version
- Tag and deploy a new release of the service (PR with code review and approval process)
- Repeat for each Lambda function

Fortunately we use the AWS CLI to deploy Lambda updates, so those get done quickly, even if still a bit tedious.

We're not using private npm modules. Instead we're using private git repos and npm's ability to load a git repo as a dependency using a git url. There's even [semver](https://semver.org/) support:

```json
{
	"dependencies": {
		"config": "git+https://<secret-key>:x-oauth-basic@github.com/alumniq/config.git#semver:^3.0.0"
	}
}
```

I've never worked in a monorepo before, but I get the feeling that this is the type of problem that the monorepo design pattern is built to solve.

## A stab in the dark

Writing all of this up has made me wonder if AWS offers a configuration service of any kind. They probably do. Kinda have to, right? Something we've discussed internally is the idea of putting our config behind an API that's only accessible inside our VPC. I'm guessing a config service product would work similarly.

I also think that our current strategy of updating `package.json` for each individual config version may be a symptom of a problem that's already been fixed. I believe there used to be a bug in npm that only affected git-url dependencies and would not install anything but the exact version number listed, even if you used `^` to indicate that minor- and patch-increases are acceptable. We burned many hours hunting that down (several times in different places) and now we have muscle memory to keep that version number up to date to prevent problems -- but I think the bug might be fixed and we could probably get away with a simple `npm update` to update `package-lock.json`, and a deploy.

There's probably a few of you out there screaming at your screen because I'm _obviously an idiot_ and should be using ... some product or service... that solves these problems for me. And to you I say, please make use of the comment form! I'm eager to improve this situation.
