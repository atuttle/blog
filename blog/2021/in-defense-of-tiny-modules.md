---
title: In Defense of Tiny Modules
desc: It's popular to vehemently hate the proliferation of tiny npm utility modules. But is that a good thing?
img: /img/2021/kevin-borrill-IEGWHoS2wY4-unsplash.jpg
date: 2021-11-17
tags:
  - clean code
  - best practices
commentsPostId: sweat-the-small-stuff
---

![Tiny umbrellas at the beach](/img/2021/kevin-borrill-IEGWHoS2wY4-unsplash.jpg)

Photo by <a href="https://unsplash.com/@kev2480?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Kevin Borrill</a> on <a href="https://unsplash.com/s/photos/tiny?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>{class="photo-byline"}

It's popular right now to vehemently hate the proliferation of tiny npm utility modules. But is that a good thing? I don't think so. [And I'm far from the first person to suggest that](https://blog.sindresorhus.com/small-focused-modules-9238d977a92a).

> Imagine if PC manufacturers all made their own CPUs. Most would do it badly. The computer would be more expensive and we would have slower innovation. Instead most use Intel, ARM, etc.

Here's someone offering to [pay people to delete their (small) modules](https://drewdevault.com/2021/11/16/Cash-for-leftpad.html).

I agree with the basic premise that there's too much garbage on NPM and as a rule of thumb the community at large is too dependent on modules that add yet more dependencies (and so on, and so on) for little value. Nobody likes installing one or two dependencies and then getting 20 vulnerability alerts; most of which are usually ignorable for one reason or another.

This vehement hatred, and the humorous-if-not-satirical offer to pay for deletions, is an overcorrection.

There are problems, but the solution isn't to burn it all down.

## Why tiny modules are good

The article I linked above specifically picks on [isArray](https://www.npmjs.com/package/isarray). And yes, it's true that the code for isArray is just a couple of lines:

```js/
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
	return toString.call(arr) === '[object Array]';
};
```

There are some subtleties of this code that are worth pointing out:

- It has tests.
- It's tested against every major desktop and mobile browser, and some smaller browsers too.
- It's a polyfill. If the execution environment (node, browser) already has `Array.isArray` defined, it uses that.

Would your slapdash from-memory implementation be able to claim the same?

The implementation is _just_ complicated enough that I wouldn't trust myself to remember how to re-implement it from scratch every time I want to use it; which makes it extremely likely that I'm going to find some random function on Stack Overflow and copy/paste it into a utility functions file in my app, and copy/paste that forward into future projects, forever, into oblivion.

This is how we did things before npm, and we stopped doing that because the new way is better.

Sharing the module provides a single, updatable source of truth if a bug or a security vulnerability is found. Contrast that with finding a bug in your utility functions file that you've been copying from project to project for 15 years. In that situation I'm probably not even going to consider going back and cleaning it up in those other projects.

## Not Invented Here

This phenonmenon has a name. [Not Invented Here](https://en.wikipedia.org/wiki/Not_invented_here). If you've been coding on the web long enough, you've run into people who opposed the idea of using a framework for organizing their code, usually with an argument that distilled down to "I don't know how the framework works, so I can't trust it." Instead they prefer to write spaghetti-code or cobble together a system of utility functions for abstracting away repetitive actions; not realizing that what they've done is to reinvent the concept of a framework but to forego the free community testing, proving, bug-hunting, and bug fixes that come from using an open source framework.

The "it's just a couple of lines of code, why install something for it?" argument rings awfully familiar to me.

## Alternative Solutions

As I said early on, this ecosystem is not without its problems. I just don't think this is one of them.

If you find node_modules expansion particularly egregious, you should seek out and use tiny utility modules only if they have zero dependencies. Dev-dependencies are acceptable, because they don't get installed when you `npm install`, even if your NODE_ENV is development. Even better, knowing that your utility module library of choice is well tested is good peace of mind. Might I recommend [just](https://github.com/angus-c/just)?

Aside from gross file count and size of node_modules, the next most common argument I hear is that vulnerability warnings are too common and usually over-blown. It's a shame that a tool with so much potential for doing good is so noisy that we've all trained oursevles to ignore it, myself included. Npm should notify the module authors and contributors at least as often as it notifies the module users. And there should be a way for vulnerabilities in their database to be marked as "only a problem in production" so that if you're using a vulnerable module downstream of something in your dev-dependencies, it doesn't even bother notifying you. And of course, if something truly malicious were to be found, like crypto-miners running inside your testing framework, then that would raise enough concern to **not** mark it as a "production-only vulnerability."

It doesn't even seem all that far-off. They're already not installing dev-dependencies for modules you install; the threshold for whether or not to display a vulnerability should be nearby, right?

These two changes alone would go a long way to healing the damage done. There's no doubt other things we can do to improve the developer experience of using tiny modules.

I think that the reason it's so popular to hate on tiny modules right now is that (1) the public can't force npm to make these changes, and so (2) it's easier to browbeat others into believing that tiny modules are bad, because it serves your purposes.

Nobody's forcing you to use _any_ modules. If you're upset that a library you want to use relies on modules that rely on modules that rely on modules you don't like, that's a decision you need to make for yourself... But it doesn't make any of the modules in that chain _bad_ or _wrong_.

If enough people agree with you, then there's a market for you to create a fork of the library that uses few/no dependencies.
