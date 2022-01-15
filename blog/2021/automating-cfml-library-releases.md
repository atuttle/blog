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

### This entry was last updated 2022-01-15 😎

This message keeps coming back into my life (not that I'm complaining)...

https://twitter.com/KentBeck/status/250733358307500032

Publishing new versions of [Taffy][taffy], my library for authoring REST API's in CFML, used to be too hard.

Not that it was **_hard_**, per se. But **_hard enough_** that I didn't do it as often as I would have liked.

I recently learned this lesson with this very website. Finally having it on a tech stack that makes it dead-simple to write and deploy new articles has meant that I'm writing much more often. (This is my 35th entry for 2021. Because of [the friction involved in posting][friction], I wrote 18 last year, and 13 the year before that.)

Compare that to [taffy.io][io] which listed version 3.1.0 (from March 2016!) as the latest version until late November of '21, whereas version 3.2.0 was released in November of 2017, and 3.3.0 was released in August of 2021. Not only that, but there were additional changes since 3.3.0 that weren't included in a new version yet, because, well... My laziness was outweighing the toil of doing a release.

## The Toil

Here's what's involved in releasing a new version of Taffy:

- As we merge pull requests with new features and bug fixes, we add them to the documentation, with an assumed version number (we should probably switch this to be something like `@next`, because sometimes the version number ends up changing...)
- Eventually &mdash;as [BDFL][bdfl]&mdash; I decide that we've reached a good moment for a release, and do the following things, if I remember them all and/or can be bothered:
  - Create a new git tag with the updated version number (obeying [SemVer][semver]), and push it to GitHub
  - Add the (hidden) docs for the new version to the version listing so that it's no longer hidden.
  - Tweet about it on [@taffyio][@taffyio] and [@AdamTuttle][@adamtuttle].
  - Share the news in the `#taffy` channel of the [CFML Slack][cfmlslack].
  - Post about it on my ~~blog~~ digital garden. Not sure if I want to continue that. 🤔
  - Update the version number on the [taffy.io][io] website.

I almost forgot to include that last list item, which illustrates how annoyingly manual this whole thing is! 😂

## Now fully automated! 🤘🏻 😎

I've...

- added a GitHub integration to the `#taffy` Slack channel, which announces new issues, pull requests, and releases (among other things).
- updated [taffy.io][io] to [display the latest release][displayrelease] info [from the GitHub API][api] at page load. Real-time updates! Huzzah!
- added a GitHub workflow that enforces use of the [SemVer][semver] labels for all Pull Requests (more on why those are required in a moment)
- added a GitHub workflow that creates a new tag, marks it as a release, generates release notes, and copies the `@next.md` documentation file as the new version number (e.g. `3.4.0.md`) so that it's possible to browse the docs for that version no matter how far we go into the future.

  - To keep things simple, since we already had a package.json in order to use npm-provided LessCSS tooling, it uses the `npm version` command to decide the new version number. This is the only input needed when creating a new release. More on that below.
  - There's a new `/.github/release.yml` file that tells GitHub how to interpret each pull request since the last version, based on the semver labels I mentioned above. If a PR has the `Semver: MAJOR` label, it gets listed under the "Breaking Changes" heading, and so-on for `Semver: MINOR` and `Semver: PATCH`. Now release notes, which were probably the biggest contributor to my release anxiety and the primary reason for lack of releases, are 100% automated!
  - In addition, I've folded the TaffyDocs repo back into the Taffy repo, for a couple of reasons. Not only does it make things simple for this automation to copy `@next.md` to `{new-version}.md`, but it means that when contributors submit a PR, the same PR can contain the code changes and the documentation changes. \*chef-kiss\*

- And lastly, the same workflow that does all of the above, tweets when there's a new release and links to the release notes.

With all of that done, the hardest part of doing a release now is keeping track of what's been merged so that I know whether I should bump the major/minor/patch version number. I've got a system for doing this manually, and the fewer updates that I include per version the easier this will be to keep track of, so I'm hopeful that releases will become more frequent and smaller, now.

[You can see the current state of my release automation here](https://github.com/atuttle/Taffy/blob/main/.github/workflows/release.yml).

[taffy]: https://github.com/atuttle/taffy
[friction]: https://adamtuttle.codes/blog/2019/friction-stops-things/
[io]: https://taffy.io
[bdfl]: https://en.wikipedia.org/wiki/Benevolent_dictator_for_life
[@taffyio]: https://twitter.com/taffyio
[@adamtuttle]: https://twitter.com/adamtuttle
[cfmlslack]: https://cfml-slack.herokuapp.com/
[displayrelease]: https://github.com/atuttle/Taffy/blob/5fded423c041edf4de7a3910967378c51bae809d/index.html#L74-L81
[api]: https://github.com/atuttle/Taffy/blob/5fded423c041edf4de7a3910967378c51bae809d/index.html#L99
[semver]: https://semver.org/
