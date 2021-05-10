---
title: "Taffy 1.2, Codename: Halfling"
summary: "Taffy 1.2, Codename: Halfling..."
date: 2012-12-27 09:00:00
tags:
  - taffy
commentsPostId: Taffy-1-2-Codename-Halfling
---

Today I'm happy to announce that Taffy 1.2 is ready and available for general use! I've been using it in production for months to power mobile web apps and native phone apps, and there have only been a handful of bug reports from other developers working with it since [the beta officially started](/blog/2012/Taffy-1-2-Beta-in-the-wild/) -- all of which have been addressed.

The [full release notes for 1.2](https://github.com/atuttle/Taffy/wiki/Releases) are available on the wiki, but here are some highlights:

 * Major rewrite of the code that converts the URI you supply into a Regex used to match incoming requests. This fixed at least 1 long-standing bug and made the whole process much saner.
 * Using `.format` (e.g. `.json`) at the end of the URL to specify desired return format had been previously deprecated. The rewrite above also addressed this, so the feature is now un-deprecated. Use it all you like!
 * You can now [use subfolders inside /resources](https://github.com/atuttle/Taffy/wiki/Organizing-your-resources-into-subfolders)
 * Provide your own [custom regex for your tokens](https://github.com/atuttle/Taffy/wiki/Custom-token-regular-expressions), which enables you to use more-similar URI patterns with more control over which CFC responds to which request.
 * Now supports quick integration with both [Hoth](https://github.com/aarongreenlee/Hoth) and [BugLogHQ](https://github.com/oarevalo/BugLogHQ) out of the box -- just a couple of variables to set in `variables.framework`. This is a cause that I've become passionate about over the last several months, as I was drowning in more error emails than ever.
 * Configuration provided via `variables.framework` (ala FW/1) -- use of `configureTaffy()` is now deprecated.

Again, the [full release notes are available on the wiki](https://github.com/atuttle/Taffy/wiki/Releases), as well as [loads of new and updated documentation](https://github.com/atuttle/Taffy/wiki/_pages).

As always, thank you so much to everyone that helped make this release possible. I consider every bug report, every question on the mailing list, and even each request for help debugging to be a sign that people like Taffy, and that motivates me to keep working on it.

I'm planning to strive for much shorter release cycles in 2013. Let's hope I can pull that off. Feel free to prod me if it's been too long!
