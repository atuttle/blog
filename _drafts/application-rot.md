---
title: Application Rot and Table Stakes
date: 2021-09-10
tags:
  - javascript
  - rot
commentsPostId:
---

start with car metaphor.

then say that linting and testing are SO "table stakes" that they're used as the example material to now claim that other things are on equal table-stakes ground: https://twitter.com/brianleroux/status/1432709953584828416

Old people[^1] are annoyed at the pace of change in the JavaScript ecosystem. Modules get updates at a seemingly breakneck continuous pace, and it can feel impossible to keep up with them.

I think that this is because they are still applying the old patterns and approaches to modern tools, and the modern tools operate from a different set of assumptions.

First things first, I hope we can all agree that all other things being equal, software getting updates is a Good Thing™.

In the before times (I refuse to think of them as "the good old days"), you wrote a web-application and maybe fixed some bugs every once in a while.

you can't let react apps rot. it's hell to return to an application years later and try to deal with a bunch of outdated dependencies.

testing tools are great. dependabot is great.

the modern frameworks get a bad rap from people who are stuck in the old ways: no tests, no security updates, and leave it to whither on the vine for years at a time.

your car will break down if you never change the oil and put electrical tape over the check engine light. modern apps require modern approaches. good tests, tools that notify you of updates, and as much automation as possible.

[^1]: If not physically old, or not _that_ physically old, then mentally old: stuck in "the old way" of doing things.
