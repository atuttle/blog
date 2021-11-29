---
title: 'Taffy 3.0.0-alpha'
summary: 'Taffy 3.0.0-alpha...'
date: 2014-08-15 09:00:00
tags:
  - taffy
---

The first _**alpha**_ of Taffy version 3.0.0 is ready for public testing!

There was a recent burst of development, thanks to some corporate sponsorship in the form of this conversation with my employer:

> "Taffy can do that, right?"
>
> "No, but it's something I've wanted to add for a while."
>
> "Go do it."

There have been a lot of changes and improvements, and one of those is that the documentation now includes a [What's new](http://docs.taffy.io/3.0.0/#What-s-new-in-3-0-0) section, so I'm not going to copy over all of that content into the blog post. There are a few [breaking changes](http://docs.taffy.io/3.0.0/#Breaking-Changes) from 2.x to 3.0 that you should be aware of, but in terms of how long it will take you to update your code, the impact is only a minute or two of your time.

The test suite is fully updated as well, so please [run the tests](https://github.com/atuttle/Taffy#running-the-tests) on your environment and report back if you have any troubles! I've verified things are working well on Adobe ColdFusion 8.0.1 and 10u13, and Railo 4.2 (Cheers to [Adam Cameron](cfmlblog.adamcameron.me) for helping out with this!), but I can't check every platform. As always, if you run into any problems, we've got the [mailing list](https://groups.google.com/forum/#!forum/taffy-users) and you can [file bug reports](https://github.com/atuttle/Taffy/issues).

**Also important:** If you try out v3 and **don't** have any problems, please let me know that, too! Silence either means nobody is testing or nobody is having problems, and there's a world of difference.

As always, thank you to everyone that submits bug reports and feature requests, participates on the mailing list, and talks about Taffy in the #ColdFusion channel on IRC. My biggest thanks this time go out to [Dan Short](https://github.com/danshort), [Jean-Bernard van Zuylen](https://github.com/jbvanzuylen), and [phipps73](https://github.com/phipps73) for their pull requests.

If all goes well with the alpha over the next few weeks, I'll release an official v3.0.0 by the end of the month.
