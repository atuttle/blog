---
title: "Taffy 3.0.0-RC1"
summary: "Taffy 3.0.0-RC1..."
date: 2014-09-19 14:44:08
tags:
  - taffy
commentsPostId: Taffy-3-0-0-RC1
---

Today I created the first Release Candidate for version 3 of Taffy: [Version 3.0.0-RC1][rc1]

Not much has changed since [the alpha][alpha]. There were a few bug fixes, and I've gotten a few pull requests that seemed like a good fit for this release, so they have been added as well. All of the additions have been added to the ["What's New" section of the documentation][new].

While this is not officially a "stable" release, it is my estimate that it _could be_. I'm using it in production without any issues; but I'm also sure my code doesn't make use of every single code-path through the framework. If you have some spare cycles it would be greatly appreciated if you could try upgrading your install and make sure everything still works.

Don't forget that there are [a few things that are going to require some code changes on your part][breaking], but they are relatively minor.

If all goes well with the RC, we could be looking at Taffy 3.0.0 stable in as little as a week! As always, thank you for your help testing and for your pull requests.

[rc1]: https://github.com/atuttle/Taffy/releases/tag/v3.0.0-RC1
[alpha]: /blog/2014/Taffy-3-0-0-alpha/
[new]: http://docs.taffy.io/3.0.0/#What-s-new-in-3-0-0
[breaking]: http://docs.taffy.io/3.0.0/#Breaking-Changes
