---
title: "Taffy 1.2 Beta in the wild!"
summary: "Taffy 1.2 Beta in the wild!..."
date: 2012-11-08 08:00:00
tags:
  - taffy
commentsPostId: Taffy-1-2-Beta-in-the-wild
---

Some recent prodding on [the Taffy mailing list](https://groups.google.com/forum/#!forum/taffy-users) lit a fire under my rear for the last few weeks and really changed the course of this release. I was reminded that smaller, more frequent releases is not only a strategy for big companies and enormous OSS projects. Us little guys can do it too; and that's just what I did.

Highlights from [the Taffy 1.2 Release Notes](https://github.com/atuttle/Taffy/wiki/Releases) include:

 * Fixed a long-standing bug with periods in token values causing issues with format detection (e.g. ".json" at the end of the URI)
 * Resource CFCs can now be organized into subfolders of **/resources**
 * You can now supply custom Regular Expressions for your tokens. Go nuts!
 * Integration with [Hoth](https://github.com/aarongreenlee/Hoth) and [BugLogHQ](https://github.com/oarevalo/BugLogHQ)
 * Configuration via `variables.framework` ala FW/1 (use of `configureTaffy()` now deprecated in favor of variables.framework)

But that's not everything, so [go read them yourself](https://github.com/atuttle/Taffy/wiki/Releases) and see everything that's new!

As always I am indebted to the contributors and users who participate in discussions, help me think through problems, and even occasionally submit patches. This release's MVP contributor is [Marco Betschart](https://github.com/marbetschar), who submitted a few code patches and was relentless (in a good way!) with bug reports, feature requests, and on the mailing list. Thanks Marco!

### This is a BETA!

All of the unit tests are passing, but there's a fair amount of new code here, including another major overhaul to the URI parsing. There's a chance that there are some bugs, so play it safe and don't put this up in production yet. But with that said, I'd still love to get feedback from anyone who can play with it; even if just a "works for me!" so that I know other people have tried it without problems.

I'm planning for about a 3 week beta period, to give people plenty of time to play with it. That puts final release in _early_ December. In the meantime, I'll be continuing to spruce up documentation.

Thanks again to everyone who has given Taffy a chance. It's been a wild ride so far and I'm excited to continue on...
