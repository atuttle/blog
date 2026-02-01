---
title: Two simple settings that make Firefox usable on OSX
desc: To be fair, Firefox has gotten a lot better since I wrote this article.
img: /img/2019/thomas-bonometti-OyO5NDiRPMM-unsplash.jpg
date: 2019-06-17
tags:
  - macos
  - google
  - firefox
---

Yep, it's kind of a click-bait title. Sorry about that. To make up for it, here's the information you're after, right up front:

```
gfx.compositor.glcontext.opaque TRUE
browser.tabs.20FpsThrobber TRUE
```

[As suggested here](https://bugzilla.mozilla.org/show_bug.cgi?id=1404042#c167). And don't forget to restart Firefox.

I've been growing more and more uncomfortable with how much I depend on Google on a day to day basis; and [their announcement of plans to cripple ad-blockers](https://www.zdnet.com/article/google-chrome-could-soon-kill-off-most-ad-blocker-extensions/) was the last straw. Google appears to be [trying to walk that back now](https://www.zdnet.com/article/google-promises-to-play-nice-with-ad-blockers-again/), but for me at least, the damage is done. I'm working hard to make Firefox work as my go-to browser.

You'd think it would be an easy process... Copy over bookmarks, install a few extensions, and go, right?

Well, gmail works _so poorly_ in Firefox (at least on OSX, at least on my machines -- I tested on two!) that it almost makes me want to believe that it's intentional, anti-competitive behavior. Could it be? Sure. Is it? I have no idea. Would I be surprised? Not at all.

So I did what you do in 2019 when things are crappy: I complained on Twitter about it. And unlike most of my other complaint tweets, I never thought I'd get any help from it. But I did!

https://twitter.com/RandomFFUser/status/1137360604006625280

Thanks, Random Firefox User.

I'm not actually using a scaled display (as I write this on my hackintosh), though I was originally using a scaled display on my Macbook Pro with its external monitor. It was happening for both. But I figured it was worth a shot and simple enough to revert if it didn't work out.

Since it's mentioned in the post they linked, I should mention that I'm not using a nightly build of Firefox (I'm currently on 67.0.2 in the stable channel). I also didn't read that entire (and very long!) thread. I did have to create the `20FpsThrobber` setting, but that was easy enough.

If you're wondering how to change these settings, open up a Firefox tab and type `about:config` in its URL bar. Then search for these settings in the search field at the top of the tab body.

And with that, Firefox is now my go-to browser.
