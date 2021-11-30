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

Not that it's **_hard_**, per se. But **_hard enough_** that I don't do it as often as I should.

I recently learned this lesson with this very website. Finally having it on a tech stack that makes it dead-simple to write and deploy new articles has meant that I'm writing much more often. (This is my 35th entry for 2021. Because of [the friction involved in posting][friction], I wrote 18 last year, and 13 the year before that.)

Compare that to [taffy.io][io] which (until a few days ago!) listed version 3.1.0 (from March 2016!) as the latest version, whereas the actual latest version is 3.3.0, from August 2021... And there have been additional changes since then that aren't in a new version yet, because, well... My laziness is currently outweighing the toil of doing a release.

## The Toil

Here's what's involved in releasing a new version of Taffy:

- As we merge pull requests with new features and bug fixes, we add them to the documentation, with an assumed version number (we should probably switch this to be something like `@next`, because sometimes the version number ends up changing...)
- Eventually &mdash;as [BDFL][bdfl]&mdash; I decide that we've reached a good moment for a release, and do the following things, if I remember them all and/or can be bothered:
  - Create a new git tag with the updated version number, and push it to GitHub
  - Add the (hidden) docs for the new version to the version listing so that it's no longer hidden.
  - Tweet about it on [@taffyio][@taffyio] and [@AdamTuttle][@adamtuttle].
  - Share the news in the `#taffy` channel of the [CFML Slack][cfmlslack].
  - Post about it on my ~~blog~~ digital garden. Not sure if I want to continue that. 🤔
  - Update the version number on the [taffy.io][io] website.

I almost forgot to include that last list item, which illustrates how annoyingly manual this whole thing is! 😂

## Some Solutions...

Some of these problems I've already solved:

- I've added a GitHub integration to the `#taffy` Slack channel, which should announce new releases (among other things). 😎
- I've updated [taffy.io][io] to [display the latest release][displayrelease] info [from the GitHub API][api] at page load.

So that leaves...

- **Tagging/Releasing:** One option would be to use a tool like [semantic release][semrel] to automate some of these processes. Or a more manual alternative would be to have 3 different GitHub Actions setup: (1) Major Release, (2) Minor Release, (3) Patch Release... I could run one of them manually from the Actions tab, which would create the tag and push it to the repo. It should be easy enough to use `npx` and the `semver` npm module to grab the current version number (from a new file), increment the version as applicable based on which action was run.
- **Tweeting:** Should be [fairly trivial][autotweet] if I use something in GitHub Actions to automate the releases...
- **Documentation:** The documentation process needs a lot of productivity improvement thinking. That'll have to be a separate effort.

It would be _**amazing**_ if deciding it was time for a release was the hardest part about releasing.

I think the hardest remaining challenge is building the release notes in the docs. I'm not sure I'll be able to automate that much, but boy I'd sure love to hear if anyone has any ideas. The current process involves iterating through every merged PR and issue resolved since the previous release, and making sure they're all properly noted and credited in the "what's new" section of the docs.

I'm considering this entry a living document. I'll be updating it as I do more to automate Taffy deploys, in hopes that it can help someone else, too.

[taffy]: https://github.com/atuttle/taffy
[friction]: https://adamtuttle.codes/blog/2019/friction-stops-things/
[io]: https://taffy.io
[bdfl]: https://en.wikipedia.org/wiki/Benevolent_dictator_for_life
[@taffyio]: https://twitter.com/taffyio
[@adamtuttle]: https://twitter.com/adamtuttle
[cfmlslack]: https://cfml-slack.herokuapp.com/
[semrel]: https://github.com/semantic-release/semantic-release
[docs]: https://github.com/atuttle/taffydocs/
[autotweet]: https://github.com/marketplace/actions/send-tweet-action
[displayrelease]: https://github.com/atuttle/Taffy/blob/5fded423c041edf4de7a3910967378c51bae809d/index.html#L74-L81
[api]: https://github.com/atuttle/Taffy/blob/5fded423c041edf4de7a3910967378c51bae809d/index.html#L99
