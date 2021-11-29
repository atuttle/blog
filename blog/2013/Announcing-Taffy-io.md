---
title: 'Announcing Taffy.io'
summary: 'Announcing Taffy.io...'
date: 2013-12-05 08:45:00
tags:
  - taffy
---

One of the weakest points in Taffy, for, well, forever, has been the (organization of the) documentation. To be fair, it's not _entirely_ my fault! GitHub wiki's kind of suck a little bit.

Fortunately I've taken steps to improve the information architecture.

## Step 1: Get an easy to remember domain

- [taffy.io](http://taffy.io) is now the primary landing page
- [docs.taffy.io](http://docs.taffy.io) is the new home of the documentation!

## Step 2: Cleanly separate docs for different versions

I know the documentation doesn't have the prettiest formatting, but that will get better with time. One of the key features of this architecture is that the documentation for each version of Taffy is now available separately (one of my biggest gripes with GH Wikis).

![Taffy Documentation Version Selector](/img/2013/Taffy_2.1.0_Documentation.png)

I've created a docs set for Taffy 2.1.0, but I have yet to update it with the changes from 2.0.1 to 2.1.0 (coming soon-ish!)

## Step 3: Enable simple collaboration

Another one of my gripes with GH Wikis is that they are either globally editable or completely locked down. I [voiced my desire for pull requests for wikis long ago](https://github.com/gollum/gollum/issues/265), but that will probably never see the light of day. That also contributed to the decision to [house the docs in their own repo](https://github.com/atuttle/TaffyDocs). As a result, anyone can now submit a pull request via normal channels for the documentation.

## Step 4: Automate all the things!

Fortunately, this change opened up opportunities for much cool integration. The docs are now being "continuously deployed" -- that is, whenever a pull request is merged or I push a change to GitHub, the documentation source is automatically compiled to HTML and deployed to [docs.taffy.io](http://docs.taffy.io). Cool stuff, eh?
