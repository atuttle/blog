---
title: TDD By Example, by Kent Beck
date: 2021-09-06
tags:
  - testing
  - tdd
commentsPostId: tdd-by-example
---

You can't really tell yet (it's in a separate git branch) but I've started the process of transitioning my blog over to be a [digital garden][jhdg], and as part of that transition I'm starting to transition to a format where I will feel more free to go back and update articles as my thoughts and opinions change, as I learn, and as the community and ecosystem grows and changes. I guess we can say this is going to be the first thing I'm _planting_ in that garden.

---

<a href="https://www.amazon.com/Test-Driven-Development-Kent-Beck/dp/0321146530?crid=1D8X147Q3MS5G&dchild=1&keywords=tdd+by+example&qid=1623418032&sprefix=tdd+by+example%2Caps%2C136&sr=8-3&linkCode=li3&tag=tuttl-20&linkId=f4d8afaabf721a86be63f5b8d30c708a&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="/img/2021/tdd-by-example-cover.jpg" style="float:right; max-width: 50%; margin-left: 10px;" /></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=tuttl-20&language=en_US&l=li3&o=1&a=0321146530" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

I've finally gotten around to cracking open the front cover of my copy of [**TDD By Example** by Kent Beck][buy], and I was thinking I might like to write down my thoughts for each few chapters as I read. I've only read the preface, introduction, and first chapter so far, and I already have thoughts I want to document.

## First Impressions

I am not usually one to read the preface or introduction of books. I don't usually have much in the way of patience. For whatever reason, my ADHD didn't get in the way this time and I chose to read them.

The preface is skippable if you really want to cut corners, but if you think you could benefit from some additional motivation and inspiration, I'd say read it. It's only a couple of pages and does a nice job of setting the mood and purpose of the book, and putting the reader into the right head-space to take on the challenges that lay ahead. It lays out the "red, green, refactor" mantra we've all heard and _think_ we understand, and explains that with proper application, tests provide what the book calls "courage."

**The introduction is required reading.** It explains a real problem that a real developer was asked to solve for a real app: It managed cash portfolios ([WyCash+][wycash] - I don't know that much about it) only in USD, and they wanted to know if it could be improved to be multi-currency. It lays out some of the challenges and how a decent application architecture and appropriate testing gave the developers confidence that they could make the requested changes -- it wasn't even a question of how long it would take, it was, "can it be done?" This paragraph does not cover the entire introduction, it's still required reading. ;)

After reading the first chapter, which I'll discuss next, I was astonished by how short it was. Only 8 pages, two of which contain 3/4-page height screen shots of the desktop application GUI for JUnit. I quickly thumbed through the first half of the book and found that every chapter appears to follow pretty much the same format. Just a few pages. I probably should have seen it coming, since TDD is all about breaking things down into the smallest possible useful segments. It was a pleasant surprise, and has contributed greatly to my motivation to keep reading.

There are 36 chapters, if you include the preface and introduction and two apendices &ndash; all of which are just as short as the chapters, some even being reduced to just a page or three. If you set out to read one chapter per day &mdash;a very attainable goal!&mdash; then you would probably find you had finished the entire book in less than a month, because there are likely to be days where you finish 1 chapter and feel eager to keep going.

So that's what I'm going to do. Starting today, I'm planning to read one chapter per day, and I'll take notes about what I read here. I'll be updating this article each time I have more to add.

With the stage sufficiently set, let's jump into the first chapter.

## Chapter 1

I am coming in to this book a little bit apprehensive. I am 100% in the camp that "automated tests are good" and that there are good ways and bad ways to test things, and that there is significant value in using the correct approach. E.g. test the feature, not the implementation. I also believe that TDD _might_ be a useful tool to ensure that you've written tests to cover every feature.

That said, _every_ TDD tutorial I've encountered to date has gone out of its way to "test" such small details _of the testing-setup itself_ that I can't help but feel that, as my English friends would say, they're "taking the piss." That is, they're going to the extreme, perhaps to make a point, but also in a manner that is so unbelievably inefficient as to perhaps get in the way of making their point.

Do you really, for _every_ project, _really_ start by writing a test that won't even _compile_? And then once you've written enough code to make it compile, writing the first test in _such a naïve manner_ that nobody would actually look at it and think it's actually a useful test?

TDD By Example, Chapter 1, does this too. We start by defining a set of constraints (a portion of what I would consider to be the software spec), and then writing a test that would maybe sort of demonstrate that we understand the concept of how to implement that algorithm in our heads for one set of possible inputs.

```java
public void testMultiplication(){
	Dollar five = new Dollar(5);
	five.times(2);
	assertEquals(10, five.amount);
}
```

Obviously this code isn't going to compile because the `Dollar` class hasn't been defined (among other problems). I'm not a Java developer so I'm not going to get into all of the intricacies of the various errors. But here's what my brain trips over:

DUH! Of course this isn't going to compile. Even I, with only 1 semester of Java experience in college (many, many years ago) can look at that and name three of the four errors that the book points out and leads us through fixing so that the test will compile and we can see it fail. I will stop short of being "offended" by such a notion, but it rubs me the wrong way.

The counter argument will be that I _am_ attempting to compile it, just in my head; and that not everyone has that ability. Ok, sure. That's a fair point. When you first learn how to do addition in primary school you have to write it out long-form, and eventually you get to a place where you can do it in your head. I will concede that, for someone new to programming, this may be a useful process.

But in school, eventually, it is accepted that you can do some basic math in your head and the teacher no longer asks you to "show your work" for simple addition as part of showing your work for integral calculus. I do hope that this book eventually makes it to that level.

I should acknowledge that while most of what I've written so far has had a bit of a negative attitude, while reading this chapter I was in a very positive mood and it did not actually upset me. I guess I just needed to get that chip off of my shoulder from past TDD trauma... so thanks for indulging me.

Obviously-failing-tests-failing-obviously aside, I did actually learn something from the first chapter.

In addition to red/green/refactor, you'll also commonly see these as the steps of TDD (copied here from chapter 1):

1. Add a little test
1. Run all tests and fail
1. Make a little change
1. Run the tests and succeed
1. Refactor to remove duplication

Upon first encountering this list, I couldn't fathom what sort of duplication might exist. The whole point of this process is to test so fervantly-tiny a component, how could we possibly have duplicated anything?

By this time, the test has been left as previously written, but the application code has started to come together as:

```java
class Dollar {
	int amount = 5 * 2;
	Dollar(int amount){}
	void times(int multiplier){}
}
```

As it turns out, the duplication in question &mdash;at least for the purposes of chapter 1&mdash; is between the (naïve) test and the (naïve) implementation. The refactoring proposed is to remove the `5*2` from the implementation. The book updates the implementation to the following:

```java
class Dollar {
	int amount;
	Dollar(int amount){
		this.amount = amount;
	}
	void times(int multiplier){
		amount *= multiplier;
	}
}
```

At this point the test passes and the code resembles the 133 characters I probably would have started with in the first place before ever running the first test. And when I did write that test, I would, less-naïvely, have included two different math assertions to prove that the tests weren't passing because of any hard-coded values.

```java
public void testMultiplication(){
	Dollar five = new Dollar(5);
	five.times(2);
	assertEquals(10, five.amount);
	five.times(3);
	assertEquals(30, five.amount);
}
```

I suppose the point of all of this is to illustrate the steps that you should follow when the problem is not one that you can do in your head.

1. First make a test that, when it passes, will prove that your feature works as expected. This is part of what upsets me about the initial test case: only testing 1 set of inputs doesn't fully prove the feature works.
1. Then iterate on the application to make the test pass, committing whatever sins of ["Clean Code"][cleancode] are necessary to get there
1. Once you're satisfied that the code actually works and the test actually proves the code works, refactor the code to be "Clean" while still passing the entire suite of tests to prove that you haven't broken anything else in the process.

I'm going to call it quits here. I'll be sure to check back in again soon when I've finished another chapter or three and have more thoughts to share.

[buy]: https://amzn.to/35hV6X3
[jhdg]: https://joelhooks.com/digital-garden
[wycash]: http://c2.com/doc/oopsla92.html
[cleancode]: https://workingcode.dev/episodes/022-book-club-1-clean-code-by-uncle-bob-martin-pt1/
