---
title: 'Automating CFML Library Releases'
desc: First make the change easy, then make the easy change.
img: /img/2021/zhang-kenny-Gx1raEg_3Zw-unsplash.jpg
credit: Photo by <a href="https://unsplash.com/@kennyzhang29?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Zhang Kenny</a> on <a href="https://unsplash.com/s/photos/relaxing?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash
date: 2021-12-01
tags:
  - open source
  - taffy
  - productivity
  - automation
---

![A man sleeps on a tree branch in a pose reminiscent of a tiger](/img/2021/zhang-kenny-Gx1raEg_3Zw-unsplash.jpg)

Photo by <a href="https://unsplash.com/@kennyzhang29?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Zhang Kenny</a> on <a href="https://unsplash.com/s/photos/relaxing?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>{class="photo-byline"}

This message keeps coming back into my life (not that I'm complaining)...

https://twitter.com/KentBeck/status/250733358307500032

Publishing new versions of [Taffy][taffy], my library for authoring REST API's in CFML, is too hard.

Not that it's _hard_, per se. But _hard enough_ that I don't do it as often as I should.

I recently learned this lesson with this very website. Finally having it on a tech stack that makes it dead-simple to write and deploy new articles has meant that I'm writing much more often. (This is my 35th entry for 2021. I wrote 18 last year, and 13 the year before that.)

Compare that to [taffy.io][io] which (until a few days ago!) listed version 3.1.0 (from March 2016!) as the latest version, whereas the actual latest version is 3.3.0, from August 2021... And there have been additional changes since then that aren't in a new version yet, because, well... I'm lazy.

## The Toil

Here's what's involved in releasing a new version of Taffy:

- As we merge pull requests with new features and bug fixes, we add them to the documentation, with an assumed version number (we should probably switch this to be something like `@next`, because sometimes the version number ends up changing...)
- Eventually, as [BDFL][bdfl], I decide that we've reached a good moment for a release, and do the following things, if I remember them all and/or can be bothered:
  - Create a new git tag with the updated version number, and push it to GitHub
  - Rename the `@next` docs to the new version number.
  - Tweet about it on [@taffyio][@taffyio] and [@AdamTuttle][@adamtuttle]
  - Share the news in the `#taffy` channel of the [CFML Slack][cfmlslack]
  - Update the [taffy.io][io] website -- which I almost forgot to include in this list, which illustrates how annoyingly manual this whole thing is!

I also used to post about it here on my blog, but I'm not sure I intend to continue doing that.

## Some Solutions...

Here are some initial thoughts on automating some of these things:

- I'll document that all new docs files should start out as `@next.md` unless and until we decide on a version number (and it's been released). This won't by itself improve the process for writing docs and release notes much, but it's a start.
- I think I'd like to have 3 different GitHub Actions configured that I could run manually from the Actions tab, which would create the tag and push it to the repo. It should be easy enough to use `npx` and the `semver` npm module to grab the current version number (from a new file), increment the major/minor/patch version as applicable based on which action was run.
- Bonus points if this same job can update the [TaffyDocs][docs] repo to rename the `@next` file accordingly!
- Tweeting about the new version should also be [fairly trivial][autotweet], once I get my bot application approved...
- Pushing a notification into the CFML Slack is also _possible_, but I don't know if the mods will be able/willing to grant me a key. I've started the ball rolling to figure out who to ask...
- ✅ I've already updated [taffy.io][io] to pull the latest release/tag info from the GitHub API, so that's one thing that doesn't _need_ improving.

I'll be updating this article as I do more to automate Taffy deploys.

[taffy]: https://github.com/atuttle/taffy
[io]: https://taffy.io
[bdfl]: https://en.wikipedia.org/wiki/Benevolent_dictator_for_life
[@taffyio]: https://twitter.com/taffyio
[@adamtuttle]: https://twitter.com/adamtuttle
[cfmlslack]: https://cfml-slack.herokuapp.com/
[docs]: https://github.com/atuttle/taffydocs/
[autotweet]: https://github.com/marketplace/actions/send-tweet-action
