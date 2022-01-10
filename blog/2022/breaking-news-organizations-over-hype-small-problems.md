---
title: 'Breaking: News Organizations Over-Hype Small Problems'
desc: 'In a move that will shock exactly nobody, news outlets are sensationalizing the latest npm module drama.'
img: /img/2022/ahmad-kanbar-cLXoMUtGi0k-unsplash.jpg
date: 2022-01-10
tags:
  - javascript
  - npm
---

![Mole](/img/2022/ahmad-kanbar-cLXoMUtGi0k-unsplash.jpg)

Photo by <a href="https://unsplash.com/@ahmad_kanbar?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">ahmad kanbar</a> on <a href="https://unsplash.com/s/photos/mole?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>{class="photo-byline"}

There has been no shortage of articles in the last few days [sensationalizing][bleeping] the fact that there's been yet-another incident on npm where someone's brain has been taken over by parasites and they've sabotaged modules they own in order to make some sort of political statement or just to be a jerk (see also: [left-pad][])...

Look at the headline for the BleepingComputer article I linked:

> #### Dev corrupts NPM libs 'colors' and 'faker' breaking thousands of apps

I suppose to normies who don't understand encryption from hashing from corruption, this might be a sufficient headline. _It's a bunch of weird characters that don't make any sense to me, so it must be corrupted!_

What actually happened? The developer published new versions of two of their popular libraries, and these new versions were intentionally broken and in lieu of doing their job, they wrote the word "liberty" a bunch of times and lots of odd-looking characters to the screen; some reports indicating that this happened in an infinite loop.

But did the developer "corrupt" the whole module? Nope. It's just a new version.

Functionally this is _no different_ from releasing a new version with a bug that's so bad the library is completely useless. It's not often that bugs that bad hit the wild, but it happens. And, as the same BleepingComputer article notes, in graf 40 (of 40):

> In the meantime, users of 'colors' and 'faker' NPM projects should ensure they are not using an unsafe version. Downgrading to an earlier version of colors (e.g. 1.4.0) and faker (e.g. 5.5.3) is one solution.

Yup, just use the previous version.

## Responsible Software Development

I think as an industry we need to start taking more responsibility for our work. There are tools, _espcially for the github+npm ecosystem_ that make it really easy to prevent this sort of thing from happening.

1. Libraries should version-lock their dependencies. Instead of specifying that anything listed as [semver-compatible][] with version 2.0.0 is ok (e.g. `"isarray":"^2.0.0"`), which seems to be the default posture, they should specify the exact version of the dependency that has been **verified to be working**. I'm not the first to point any of this out. [The top comment on the top answer for the top Stack Overflow question about usage of `~` vs `^` in dependency version specification][so_comment] makes the same plea: "DO NOT BLINDLY ACCEPT DOWNSTREAM DEPENDENCIES."
1. Use a tool like [dependabot][] to stay aware of new releases of packages that you depend on.
1. Use automated tests and continuous integration tools like [GitHub Actions][actions] to automatically test the new dependency version for compatibility with your library.
1. If the automated tests pass, [auto-merge the pull request][automerge].

I do all of these things for this website (except #1, because it's not a library). And when those PR's are auto-merged after the tests pass, the website is automatically re-deployed. The dependency graph of this website keeps itself completely up to date in an entirely automated fashion, and if something were to make the tests fail, the pull request would sit there open as a nag for me to take a look at it.

All of these things I've listed above have extremely generous free tiers. In fact I think the only one that might eventually charge you is Github Actions, which gives you 3,000 minutes per month for free. If your project got 10 updates per day, running the tests would have to average > 9.6 minutes per run before you'd run out of free minutes, even in a month with 31 days. Simply put: not very likely to happen.

## Conclusion

Did some stuff break? Yup. Here on the internet we call that "a day that ends in -y".

Get used to it.

Learn from it.

Do better.

[bleeping]: https://www.bleepingcomputer.com/news/security/dev-corrupts-npm-libs-colors-and-faker-breaking-thousands-of-apps/
[left-pad]: https://github.com/left-pad/left-pad/issues/4
[semver-compatible]: https://docs.npmjs.com/cli/v8/configuring-npm/package-json#dependencies
[so_comment]: https://stackoverflow.com/questions/22343224/whats-the-difference-between-tilde-and-caret-in-package-json#comment45166739_22345808
[dependabot]: https://docs.github.com/en/code-security/supply-chain-security/keeping-your-dependencies-updated-automatically/about-dependabot-version-updates
[actions]: https://github.com/features/actions
[automerge]: https://github.com/ahmadnassri/action-dependabot-auto-merge
