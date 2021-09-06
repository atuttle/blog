---
title: "Taffy 1.3.3, 1.2.1 Maintenance Releases"
summary: "Taffy 1.3.3, 1.2.1 Maintenance Releases..."
date: 2013-08-12 17:58:17
tags:
  - taffy
commentsPostId: Taffy-1-3-3-1-2-1-Maintenance-Releases
---

If you'll recall, I reported a bug in Taffy [13 days ago](/blog/2013/Taffy-Bug-Warning-Danger-when-Managing-Custom-Representation-Class-in-a-Bean-Factory/) whereby race conditions could occur if you place a CRC (Custom Representation Class) inside your resources folder (or if your 3rd party bean factory treats your CRC as a singleton). I apologize for not getting this fixed faster, but I've been away on vacation for the last week and between my blog post and my vacation I was working overtime on a project for work. I'm back now, and I have the fix for you.

 * If you're using a 1.3.x version of Taffy (this is the current stable production-ready release), grab [Version 1.3.3](https://github.com/atuttle/Taffy/releases/tag/v1.3.3).
 * If you're using version 1.2 of Taffy, grab [Version 1.2.1](https://github.com/atuttle/Taffy/releases/tag/v1.2.1).

These versions both include a fix for the described issue, and of course a new unit test to check it. Thanks for your patience!
