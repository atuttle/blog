---
title: On Resisting the Urge to Rush Testing
summary: Moving slow and methodically can be really hard if you've been training for years to move fast and break stuff.
img: https://adamtuttle.codes/img/2021/race.jpg
date: 2021-06-30
tags:
  - learning in public
  - testing
  - tdd
commentsPostId: shrug
---

I am very much in favor of automated testing. I understand the benefits and I need them in my life. But if I'm being honest, I know that the confidence of a passing test suite is only as good as the _effort_ that went into writing it. So then it stands to reason that one of the most important tenets of the testing ethos should be something like, "Slower is better if you identify more test cases."

### Passing tests prove only that the remaining bugs haven't been found

> "Program testing can be used to show the presence of bugs, but never to show their absence!" &mdash; Edsger W. Dijkstra

Do you recall that application that I was writing and [trying to use to experiment with TDD](https://adamtuttle.codes/tags/testing/)? Here's something I didn't tell you at the time.

I was feeling very fatigued from so much additional test writing, and the learning necessary to write my tests well. I had pre-written a couple of dozen test stories and I was laser-focused on writing tests for them, and on reaching 100% code coverage, and as a result I occasionally ignored when I would find a bug in the code that wasn't covered by my tests.

To rephrase:

Occasionally, as I was trying to get my tests to prove the thing they were intended to prove, I would accidentally trip over a bug in the code. And instead of writing an extra test to prove that there was a bug ("red"), I jumped ahead to fixing the bug ("green") so that I could get back to writing the test at hand.

I let my fatigue and my desire to be done take precedence over doing the correct thing.

It's too late now. I can't remember what the bugs were, and they're fixed in the code. It would be possible to go back and write additional tests to prove that those bugs aren't in the code, if I could remember what they were, but I don't. And that's where I failed myself.

This time.

The lesson I choose to take away from this experience is that, _yes, testing well is **hard** and **slow**, at first._ BUT! It's important.

Nobody denies that you've got to crawl before you can walk, and you've got to walk before you can run. That's common sense. But when you can already write good, clean code quickly and you intentionally slow yourself down by learning to write tests at the same time... the pain is real! It takes conscious and sometimes vigorous effort to do the right thing, slow down, and write the tests you weren't planning to write.

I had a friend who is very much farther ahead of me on the testing trail read the first draft of this article and he not only agreed with what I've said, but also admitted that sometimes he does this too. So we're not alone. To err is human.

We're learning to walk, here. We're going to have some exciting moments of success, and we're also going to fall flat on our butts sometimes. Do the best you can in the moment, and take time later to reflect on what you could have done better. (This article is me reflecting!)

The next time I'm feeling test-fatigued, I should give myself a break. Go for a walk, pet the dog, have a conversation with my kids... Something to put more fuel in the tank and give me the willpower to continue fighting the good fight.

If we want our companies to be willing to give us the extra time to write tests, we have to be willing to write them all &mdash; at least the ones we know about.
