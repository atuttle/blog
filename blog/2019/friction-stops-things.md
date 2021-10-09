---
title: Friction Stops Things
desc: Death by 1,000 papercuts is an all too real phenomenon.
img: /img/2019/clark-van-der-beken-CSkriQWeTVs-unsplash.jpg
date: 2019-04-16
tags:
  - inspiration
  - writing
---

Oh my. I haven't written a blog post since November 2017. I wonder why that is. 🤔

https://twitter.com/mipsytipsy/status/1117858830136664067

I guess it's not a direct parallel, but this tweet[^1] really struck a chord with me, in more areas than just the Friday-deployments problem space mentioned. Friction stops things.

I converted my old dynamically rendered blog from a CFML platform to a static site generator because because I wanted a place where I could experiment with something new and interesting, and because static site generators were all the rage. I figured if it was as simple as compiling and pushing to GitHub, that would be pretty low-friction, and I would be able to write more often.

I think we can safely conclude that the experiment was a failure.

Normally I wouldn't think that saying, "Friction Stops Things" would even be worth saying, but hey... If the President of the United States of America (a Stable Genius, I'll remind you) is throwing out ["Maybe they should put some water on that fire"][trumpquote] as advice, maybe this level of insight could actually prove useful to someone.

Obviously the tooling I was using for the previous iteration of my static-site blog was still too high-friction. Truth be told, running it on GitHub Pages meant that I had to run the compile step, change into the generated content folder, which was a clone of the `gh-pages` branch of the same repo, and then commit and push those changes. Huge pain? No, of course not. But I guess my laziness knows no bounds.

Which leads me to the new tooling: Gatsby and Netlify. I've been hearing nothing but heaps of praise for these things and if I understand correctly, all that I will need to do to post a new entry is to create and commit/push a new markdown file.

Easier. Easy enough? I guess we'll see.

[^1]: It's more than just one good tweet, actually. It's a fantastic Twitter thread; and in some ways it has parallels to what I'm getting into here, but I thought it would be too distracting to pull them all in. But seriously, go read the whole thread!

[trumpquote]: https://twitter.com/realDonaldTrump/status/1117844987293487104
