---
title: "Testing Media Roundup #1"
desc: Sharing some of the articles I've been reading, and videos I've been watching, specific to testing.
img: /img/2021/herd.jpg
date: 2021-06-11
tags:
  - testing
commentsPostId: testing-media-roundup-1
---

The project I was using to push myself forward on testing stuff? I wrapped that up at the end of last week. It's by no means perfect, but it's better than it would have been without tests, and it works, and it's on its way to production. I would love to get the opportunity to go back and make the tests themselves better, cleaner, and smarter. I've already learned a few things that I would do differently next time.

But in the meantime, my ongoing projects aren't tested with automated-tests (for _\*reasons\*_) and life must go on. Momentum takes lots of different forms. So instead of pondering testing while working, this week I tried to consume a bunch of testing content from others. My podcast cohosts suggested that I should share that content here, for people who might be interested in it but who wouldn't have otherwise seen it. I'm happy to oblige. Maybe this will become a regular thing? 🤷‍♂️

## Are we all doing TDD wrong?

Firstly, here's a TDD conference presentation video I enjoyed. He ran out of time towards the end, just when I thought he was getting to the good stuff, so I think this could have benefited from another 15 minutes, but it definitely succeeded at churning something up inside me. I will definitely need to watch this again and try to figure out how I should be changing my workflows.

In particular I was struck by the way he stresses the red-green-refactor ("RGR") cycle and the specific benefits available from doing it right. I think until now I was treating RGR as a quick checkbox to be able to say I was doing TDD and not really a process that derives benefit.

<iframe width="560" height="315" src="https://www.youtube.com/embed/EZ05e7EMOLM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## What is an "integration" test, anyway?

And perhaps more interestingly, is it different depending on the types of systems you're testing?

I'm a big fan of [Kent C. Dodds][kcd] and his [blog][kcdblog], his [courses][kcdcourses], and his [open source work][kcdopensource]. Some of the stuff he's been teaching came under scrutiny recently by [Tim Bray][testingin20], and then by [Martin Fowler][fowler]. Kent responded with an explanation of [the way he thinks about this problem][kcdtrophy], and I think he does a great job turning the conversation toward something useful.

At the end of the day, does it matter if we disagree on what makes something an "integration test"? Does it matter if I have too many "integration" tests in your opinion? I think not. Anything that encourages people to write more tests, and helps them figure out how to do that well, is just fine with me.

## I got the book

<a href="https://www.amazon.com/Test-Driven-Development-Kent-Beck/dp/0321146530?crid=1D8X147Q3MS5G&dchild=1&keywords=tdd+by+example&qid=1623418032&sprefix=tdd+by+example%2Caps%2C136&sr=8-3&linkCode=li3&tag=tuttl-20&linkId=f4d8afaabf721a86be63f5b8d30c708a&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="/img/2021/tdd-by-example-cover.jpg" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=tuttl-20&language=en_US&l=li3&o=1&a=0321146530" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

From what I understand, if TDD has a Bible it is [Test-Driven Development By Example, by Kent Beck][tddex]. So I bought myself a copy. I haven't even cracked the cover open yet, but I'm trying to take this aspect of my professional development seriously so I'm quite looking forward to better understanding TDD. I don't know about you, but I have a really bad habit of hearing a few people talk about a concept &mdash;like TDD&mdash; and then fooling myself into believing that I understand it enough to do it, without any sort of training formal or otherwise.

It's time to admit to myself that I don't _actually_ know much about TDD, and that I could benefit from learning it from the TDD Bible. And then, you know... Do it.

[kcd]: https://kentcdodds.com
[kcdblog]: https://kentcdodds.com/blog/
[kcdcourses]: https://kentcdodds.com/courses
[kcdopensource]: https://github.com/kentcdodds/
[testingin20]: https://www.tbray.org/ongoing/When/202x/2021/05/15/Testing-in-2021
[fowler]: https://martinfowler.com/articles/2021-test-shapes.html
[kcdtrophy]: https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications
[tddex]: https://amzn.to/35hV6X3
