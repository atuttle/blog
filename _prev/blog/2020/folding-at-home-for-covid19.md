---
title: How to get started Folding@Home for COVID19 research
date: 2020-04-10
tags:
  - pandemic
commentsPostId: folding-at-home-covid19
---

Well this is nuts, huh? _\*gestures broadly\*_

I want to keep this short and sweet to not waste any of your time, so let's just jump right into it, right? Most of us probably have _at least_ 1 computer running 24x7 these days. That includes a lot of time where it's doing little, if anything, of value. Before the pandemic hit, I had heard of [Folding@Home](https://foldingathome.org/) but never got involved. When some coworkers found out that some COVID19 research was being done on the platform, most of us jumped at the chance to help.

If you don't already know, it's a way to let your computer contribute to distributed protein-folding research.

## The short, short version (for nerds)

If you're on a mac and you have docker installed, you can probably run [this makefile](https://gist.github.com/atuttle/4c4b3c9d4f3cec46d59015a20750af24) (that I wrote) to get started. It literally takes only a couple of minutes to download the dependencies and start everything up, and then you're online and folding. You could stop there, or you could [install the controller app](https://foldingathome.org/start-folding/) which will allow you to tweak your power-consumption settings, watch the logs of what your process is doing, and have a bit more control over it.

## For everyone else

If you don't have a mac, or docker, or you don't know how to use a makefile, no worries. Just [download the installer from here](https://foldingathome.org/start-folding/) and you'll be up and running just as fast.

## Everything else

By default after you start your folding@home process for the first time, you'll be configured to run work units for "any disease", which is currently the best way to contribute to COVID19 (there's no dedicated disease preference for it); so that's great. You also start folding anonymously. You can sign up for an account and get a passkey ([here](https://apps.foldingathome.org/getpasskey)) to take credit for your work, and doing so also allows you to contribute to a team. If for some reason you want to contribute to our team, our team id is `250123` 🤘

Personally, I am running this on both my work computer and my HTPC, both at full-power constantly, and aside from the fan noise and thermal output, I haven't noticed a difference in my computer's speed; which is pretty great! I'm helping out and my work and daily usage of the computer is unaffected! Granted, [I have a pretty highly-spec'd computer](/blog/2019/building-a-hackintosh-2019/), but still...

There are leaderboards, if you're into that sort of thing. With 4 of us at [AlumnIQ](https://www.alumniq.com/) folding, it took [us](https://stats.foldingathome.org/team/250123) about 10-14 days to break into the top 4% of teams. The top tier teams have many orders of magnitude more members and resources they can bring to bear, so our chances of ever catching them are basically nil, but it's fun anyway. We have a small slack celebration any time any of us hits a points milestone.
