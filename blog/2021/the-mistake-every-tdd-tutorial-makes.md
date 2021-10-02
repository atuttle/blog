---
title: The Mistake that Every TDD Tutorial Makes
desc: "Most TDD tutorials assume it's your first day behind the keyboard"
img: /img/2021/rage.jpg
date: 2021-09-09
tags:
  - testing
  - tdd
commentsPostId: tdd-chip-on-my-shoulder
---

# The Mistake that Every TDD Tutorial Makes

I refactored this article out of [[2021/tdd-by-example-kent-beck | my notes on the book TDD By Example by Kent Beck]] because it's my website and I can do what I want. 😜 While what I have to say here sounds negative &mdash;even to me&mdash; I am actually quite excited to learn TDD and improve my testing skills. I guess I'm just tired of being treated like a "child," as it were. Thanks for indulging me.

I hold the opinion that "automated tests are good" and that there are good ways and bad ways to test things, and that there is significant value in using the correct approach. E.g. test the feature, not the implementation. I also believe that TDD _might_ be a useful tool to ensure that you've written tests to cover every feature. I haven't finished reading the [TDD Bible][tddbyex] yet, so I am withholding my opinion on that for now.

But _every_ TDD tutorial I've encountered to date has gone out of its way to "test" such inane details _of the testing-setup itself_ that I can't help but feel that, as my English friends would say, they're "taking the piss." They're going to the extreme, perhaps to make a point, but also in a manner that is so unbelievably inefficient and annoying as to get in the way of making that point!

> _**If you wish to write software with TDD, you must first invent the universe.**_

Do you really, for _every_ project, _**really**_ start by writing a test that won't even _compile_? And then once you've written enough code to make it compile, writing the first test in _such a naïve manner_ that nobody would actually look at it and think it's actually a useful test?

Of course you don't. Because that would be a waste of your own time, and that's not what TDD is about, is it?

**Be honest with your audience.**

Tell them that half of the point is to learn how to break things down into the absolute smallest possible testable-chunks, which sometimes are even just a single character change; and the other half of the point is to learn how much is too much without stopping to add more tests. (Did I get that right? I'm no TDD expert.) (Note: Reserving this space for whatever additional/updated thoughts I might have after I finish reading TDD By Example.)

Would you invite Isaac Newton in for a lesson on Quantum Computing and start by asking him to show his work on some long division?

_God, I hope not._

No, you show respect for his established skills and you try to meet him at a place that makes sense given that context to create a pleasant on-ramp into the topic at hand.

I am not comparing myself to Isaac Newton &ndash; far from it. But taking examples to their extremes is often illustrative, as I hope this one shows.

My point is that there's a huge difference between teaching someone new to development and teaching someone with 20 years of experience, and those different audiences need different approaches.

A beginner might not have the experience to look at some code and know that it won't compile because the class under test isn't even defined.

The experienced developer is doing that pre-compile step in their head, and there's nothing wrong with that. The step doesn't add any lasting value if it doesn't live on in the tests once the exercise is over. Its only value was in demonstrating just how microscopic a change is testable.

That's it. Maybe consider adding a different introductory chapter/section of your guide specifically for developers with lots of experience coding, and even experience writing tests, who are following your guide specifically to learn the TDD part.

Whatever you do, try to meet your students _where they are_.
