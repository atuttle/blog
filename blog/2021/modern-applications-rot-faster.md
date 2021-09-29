---
title: Modern Applications Rot Much Faster, and Maybe that's a Good Thing
date: 2021-10-10
desc: An argument for updating how we think about long term application maintenance as compared to how we think about application development. Modernizing the latter without the former can have agonizing consequences.
img: https://adamtuttle.codes/img/2021/error-420-4CdIv6SZkck-unsplash.jpg
tags:
  - javascript
  - rot
---

![An abandoned tank](/img/2021/error-420-4CdIv6SZkck-unsplash.jpg)

<div style="text-align:right; margin-top: -25px"><small>Photo by <a href="https://unsplash.com/@error420?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Error 420</a> on <a href="https://unsplash.com/s/photos/rotten?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a></small></div>

Your car will break down if you never change the oil and put electrical tape over the check engine light. Will you be surprised when you're stuck on the side of the road?

Modern web applications are no different. Good tests, tools that notify you of dependency updates, and a significant amount of automation **are table stakes, now**. If you don't have them, you're behind.

That's not to imply you're destined to fail, but you're going to have to work harder than the people that do have them.

- You'll be doing a lot of manual testing: for new features, and again when bugs become apparent.
- You'll be monitoring for updates to the libraries and frameworks that you depend on (and probably doing a lackluster job of it).
- And you'll be deploying releases, managing changelogs, installing dependency updates, testing those updates, and so on, all manually, because you haven't automated it.

All of this while the modern _table-stakes-compliant_ developers are busy shipping new features.

Linting and automated testing are such assumed, taken-for-granted table stakes that they're used as the example for other things that should also be table stakes:

https://twitter.com/brianleroux/status/1432709953584828416

Yes, absolutely, there is an up-front cost to writing automated tests and deploy automation and dependency monitoring. And yes, spending that time and money up front can feel painful, like it's slowing you down. But any CEO worth her paycheck will understand that investing that time and money up front is going to pay huge dividends in the long term, allowing her team to not continue to pay the ever-increasing taxes and fees on having chosen the shortcut of skipping them.

All of the time you spend running manual tests after fixing a bug to make sure the fix worked and didn't break anything else &ndash; that's paying interest on the loan you took out by not writing automated tests. Regressions happen when you add new features? That's the _we don't have tests_ tax.

It's like the board game "Life" where you're presented with the choice between going into the trades or going to college within your first turn or two, except that your decision will absolutely have lasting effects and they actually make sense when compared with the real world. (Sorry, I hate that game...)

Your time costs money (see also: your paycheck). If you spend some of your time writing automated tests that will save you time later, you've given the company a better value for their money. Repeat that for deploy automation, and dependency monitoring, and a dozen other tedious and human-error-prone tasks. **And the longer the application lives, the more the benefits compound.** It's common sense to invest in an easier future for your team and your company.

![Chart showing contrasting cumulative time spent on automated tests vs. cumulative time spent manual testing](/img/2021/automated-testing.png)

And yet...

Most freelance contracts for an existing application (possibly even full-time positions) will have zero tests and zero automations the first time you walk in the door.

## Time to update your thinking?

Old people[^1] get annoyed at the pace of change in the JavaScript ecosystem. Modules get updates at a seemingly breakneck, continuous pace, and it can feel impossible to keep up with them. This feeling of overwhelm is caused from applying the old patterns and approaches to modern tools.

I hope we can all agree that all other things being equal, software getting updates is A Good Thing™.

In 1998 you would write a web-application using PHP and probably nothing else. _Maybe_ you used a framework, and if you did that put you in the upper-echelon of _webmasters_. But that was it. You wrote your app and maybe you fixed some bugs every once in a while. Once every few years there's a new version of PHP or your framework and you have to upgrade that. This style of application maintenance is orthogonal to the very concept of using dozens of open source libraries and those libraries depending on other libraries, and that weekly, if not daily, something somewhere in the dependency tree is updated.

Go back in time 20 years, find a webmaster, tell them about the pace of modern development ecosystems, and watch their head explode.

Modern JavaScript applications rot _rapidly_. And at least in some ways I think it's a good thing. By utilizing a lot of open source code and adopting a posture of staying on top of updates we're more likely to squash bugs before our users ever knew they existed. More importantly, some of those will be security vulnerabilities, making our applications more secure by the day. If we can find a way to reduce the difficulty of staying on top of it (spoiler alert: we can) then this is a great posture to take.

Letting a React application rot sucks. The old way of thinking &mdash;once it's done, don't touch it any more&mdash; does more harm than good. Sure, you've got your `package-lock.json` file so you should be able to keep using the same build chain in perpetuity, _right_? That might be true as long as you never need to change anything about any of your dependencies. But how likely is that?

Time moves unceasingly forward. There's bound to eventually be a bug fix or a new feature that you _have to have_ because _reasons_, and before you know it your version of Webpack is 4 major versions behind the state of the art, the documentation for that old version is lost to the ether, and the new version of `FooWidgets` with your must-have feature depends on the latest version of Webpack. Now you're stuck. You have no choice but to upgrade your build chain, and the requirements spider out like the windshield of a car following too closely behind a dumptruck leaving a quarry. It takes weeks to upgrade everything and get it to compile again, and even when you do there are still some little quirks where things aren't quite the same as they used to be, and not in a good way.

## Now what?

Fortunately, the state of the art in tooling for these problems is fantastic, and easier than ever before.

Start with [Dependabot][dependabot]. It's the easiest to setup and at least you'll know when there are updates available. It's also really easy to add [ESlint][] and [Prettier][] to JS applications and while they are less likely to find actual bugs they add value in other ways.

From there I'd say it's a 50/50 toss-up between automated testing and deploy automation. Maybe start by adding tests for the things you find yourself testing most often, and the things that are most mission-critical (collecting payments, for example), and then work on deploy automations. I recommend [jest][] and [testing-library][] for testing.

Deployment automation will depend heavily on your infrastructure, but hypothetically let's say you're using AWS. Learn the [aws-cli][] and use automatable solutions like docker and ECS, rather than connecting to a Windows EC2 instance over RDP to do a git pull with a git gui application. There's a steeper learning curve, but it's worth it.[^2]

Work on what will save you the most time, first. Don't agonize over which big win to tackle first. If there are multiple, do the easiest one first. If there are multiple easy automations (lucky you!) do the one that looks like the most fun first. The goal is to [eventually automate as much as you can][kcd-automation] to make it easier to stay focused on the work of writing and improving your code, but by starting with the things that save the most time first, you're creating more time to work on automations.

[^1]: If not physically old, or not _that_ physically old, then mentally old: stuck in "the old way" of doing things. If you don't get annoyed: congratulations, you're (at least mentally?) young.
[^2]: See also: This entire article.

[dependabot]: https://docs.github.com/en/code-security/supply-chain-security/keeping-your-dependencies-updated-automatically/enabling-and-disabling-version-updates#enabling-dependabot-version-updates
[jest]: https://jestjs.io/
[testing-library]: https://testing-library.com/
[eslint]: https://eslint.org/
[prettier]: https://prettier.io/
[aws-cli]: https://aws.amazon.com/cli/
[kcd-automation]: https://kentcdodds.com/blog/automation
