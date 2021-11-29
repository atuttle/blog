---
title: 'Taffy 2.2.0 Watermelon Released'
summary: 'Taffy 2.2.0 Watermelon Released...'
date: 2014-01-21 10:00:50
tags:
  - taffy
---

The biggest news this time around is that we now have a shiny new logo!\*

![Taffy Logo](https://raw.github.com/atuttle/Taffy/master/dashboard/logo-lg.png)

As ever, the [full release notes for Taffy 2.2.0](https://github.com/atuttle/Taffy/releases/tag/v2.2.0) are available on GitHub.

![Taffy Metrics](/img/2014/taffy_metrics.png)

In addition to the new logo, my second favorite addition is that Taffy now returns additional headers that show you where time was spent on the server, to help find any performance bottlenecks that may pop up. These values are listed in milliseconds and are not perfect because there is some rounding involved.

- **TIME-IN-ONTAFFYREQUEST** should be obvious, this is the time it takes for your OTR function to run.
- **TIME-IN-PARSE** is the time needed to figure out what's being requested. This can get somewhat complex at times. I would expect the value to go up if you're using a bunch of tokens, for example.
- **TIME-IN-RESOURCE** is the amount of time spent inside your resource cfc, for example, running the GET method.
- **TIME-IN-SERIALIZE** is the amount of time needed to serialize the data to the requested format. Handled by your custom representation class or the framework default -- either way it will be reported here.
- **TIME-IN-TAFFY** is the end timestamp minus the start timestamp of the request, minus the other duration values above. It's conceivable but unlikely that this might go negative! Again, that would just be a rounding error -- no big deal.

I'm so glad that [Richard Poole requested this feature](https://groups.google.com/forum/#!topic/taffy-users/OSXdem_tfeU) because while I always knew that Taffy is _ridiculously fast_ I didn't have any numbers to back that up. Now I do, and Taffy is even faster than I expected!

Thanks to [Richard Poole](https://groups.google.com/forum/#!topic/taffy-users/OSXdem_tfeU), [Jesse Franceschini](https://github.com/gensior), [Cody Martin](https://github.com/codymartin), [marbetschar](https://github.com/marbetschar), [Lee Howard](https://github.com/leeahoward), [Bill Rawlinson](https://github.com/finalcut), [Aaron Martone](https://github.com/AaronMartone), [Tony Junkes](https://github.com/cfchef), [Andy Matthews](https://github.com/commadelimited), and [w1nterl0ng](https://github.com/w1nterl0ng) for your bug reports and other contributions to this release!

\* Stroz can _"occupy me"_ if he doesn't like it.
