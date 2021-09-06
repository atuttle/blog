---
title: "Taffy 1.1, Codename: Cowbell"
summary: "Taffy 1.1, Codename: Cowbell..."
date: 2012-06-27 08:00:00
tags:
  - taffy
commentsPostId: Taffy-1-1-Codename-Cowbell
---

It was beginning to seem like Taffy 1.1 would turn into vaporware, but I'm happy to report that it definitely is not. I'm thrilled to officially release Taffy 1.1 (codename: cowbell) today!

![SNL "more cowbell" skit](//img/2012/cowbell.gif)

### Highlights

A lot has changed. You can [read the full release notes on the wiki](https://github.com/atuttle/Taffy/wiki/Releases), but here are the highlights:

 * Now fully tested and supported on Railo 3.2+!
 * Extensive test suite added to prevent regressions and aid community contributions.
 * Moved mime type configuration into representation class metadata instead of Application.cfc configuration code.
 * Snippets for CFEclipse/CFBuilder.
 * Overhauled Bean Factory (ColdSpring) integration. Now support 3 different integration levels.
 * LOTS more [examples](https://github.com/atuttle/Taffy/tree/master/examples) included in the download.
 * TONS of [new documentation](https://github.com/atuttle/Taffy/wiki/So-you-want-to-\(Index\)).
 * Now support streaming files and binary variables (like images).
 * Added notion of "unhandled paths" (similar to FW/1), where you can specify a set of subfolders inside your API that Taffy will not take over the request lifecycle.
 * Image/file uploads!
 * Bug fixes, of course...

Did you know that [we have a google group][2] now, too?

### Deprecation Warnings

Both the `registerMimeType()` and `setDefaultMimeType()` methods are now deprecated and scheduled to be removed as early as version 2.0. If your existing code uses these methods, take a look at the [Configuration via Metadata](https://github.com/atuttle/Taffy/wiki/Configuration-via-Metadata) wiki page.

Additionally, representation class overrides (providing a 2nd argument to the `representationOf` method) are now deprecated and will be removed in version 2.0. If you're using this feature currently, please contact me (email, [google group][2])! I can't think of a valid use case for it, but if you have one then I can re-open [the ticket that brought my attention back to this "feature"][3].

### Contributions

Taffy has been the first open source project I've ever worked on in which I had the pleasure to work with several volunteers providing patches (pull requests, these days), and I owe them all a great debt of gratitude. In no particular order, they are: [Brian Panulla](http://ghostednotes.com/), [David Long](http://davejlong.com/blog/), [Greg Moser](http://www.gregmoser.com/blog/), [Dan Lancelot](http://www.danlance.co.uk/), [Steve Rittler](http://www.countermarch.com/), and [Barney Boisvert](http://www.barneyb.com/barneyblog/). I sincerely apologize if I'm forgetting anyone!

And of course, thank you to everyone who submits bug reports and enhancement requests!

### What's next?

Planning for the next version of Taffy [has already begun](https://github.com/atuttle/Taffy/issues?milestone=2&state=open). Whether that release is version 1.2 or 2.0 is yet to be decided. The [Roadmap](https://github.com/atuttle/Taffy/wiki/Roadmap) is available on the wiki.

### Thank You!

As always, I am humbled by the positive reaction people seem to have to Taffy. Thank you all for trying it, and I hope it lives up to your expectations!

### Download

 * [Download the 1.1 zip](https://github.com/atuttle/Taffy/zipball/v1.1)
 * [Download the 1.1 tgz](https://github.com/atuttle/Taffy/tarball/v1.1)

[2]: http://groups.google.com/group/taffy-users
[3]: https://github.com/atuttle/Taffy/issues/18
