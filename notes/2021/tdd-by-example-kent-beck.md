---
title: Notes on TDD By Example, by Kent Beck
summary: My thoughts, review, and notes on the Bible of TDD
date: 2021-09-06
img: https://adamtuttle.codes/img/2021/tdd-by-example-cover.jpg
redirect_from: /blog/2021/tdd-by-example-kent-beck
favorite: true
tags:
  - testing
  - tdd
commentsPostId: tdd-by-example
---

To the best of my knowledge, [**TDD By Example** by Kent Beck][buy] is the _bible_ of TDD, and I want to get better at testing and stop pretending that I understand how TDD is different from just making sure you have tests, so I bought a copy. What follows is the notes I took while I was reading it. It's a mixture of the lessons in the book and my thoughts on the book, the lessons, and the teaching methods.

<a href="https://www.amazon.com/Test-Driven-Development-Kent-Beck/dp/0321146530?crid=1D8X147Q3MS5G&dchild=1&keywords=tdd+by+example&qid=1623418032&sprefix=tdd+by+example%2Caps%2C136&sr=8-3&linkCode=li3&tag=tuttl-20&linkId=f4d8afaabf721a86be63f5b8d30c708a&language=en_US&ref_=as_li_ss_il" target="_blank"><img src="/img/2021/tdd-by-example-cover.jpg" style="border: 0; max-width: 75%; margin: 0 auto; display: block;" /></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=tuttl-20&language=en_US&l=li3&o=1&a=0321146530" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

## First Impressions

I am not usually one to read the preface or introduction of books. I don't usually have much in the way of patience. For whatever reason, my ADHD didn't get in the way this time and I chose to read them.

The preface is skippable if you really want to cut corners, but if you think you could benefit from some additional motivation and inspiration, I'd say read it. It's only a couple of pages and does a nice job of setting the mood and purpose of the book, and putting the reader into the right headspace to take on the challenges that lay ahead. It lays out the "red, green, refactor" mantra we've all heard and _think_ we understand, and explains that with proper application, tests provide what the book calls "courage."

**The introduction is required reading.** It explains a real problem that a real developer was asked to solve for a real app ([WyCash+][wycash]) - It managed cash portfolios only in USD, and they wanted to know if it could be improved to be multi-currency. It lays out some of the challenges and how a decent application architecture and appropriate testing gave the developers confidence that they could make the requested changes &ndash; it wasn't even a question of how long it would take, it was, "can it be done?" This paragraph does not cover the entire introduction, it's still required reading. ;)

After reading the first chapter, which I'll discuss next, I was astonished by how short it was. Only 8 pages, two of which contain 3/4-page height screen shots of the desktop application GUI for JUnit. I quickly thumbed through the first half of the book and found that every chapter appears to follow pretty much the same format. Just a few pages. I probably should have seen it coming, since TDD is all about breaking things down into the smallest possible useful segments. It was a pleasant surprise, and has contributed greatly to my motivation to keep reading.

There are 36 chapters, if you include the preface and introduction and two appendices &ndash; all of which are just as short as the chapters, some even being reduced to just a page or three. If you set out to read one chapter per day &mdash;a very attainable goal!&mdash; then you would probably find you had finished the entire book in less than a month, because there are likely to be days where you finish 1 chapter and feel eager to keep going.

So that's what I'm going to do. Starting today, I'm planning to read one chapter per day, and I'll take notes about what I read here. I'll be updating this article each time I have more to add.

With the stage sufficiently set, let's jump into the first chapter.

[buy]: https://amzn.to/35hV6X3
[jhdg]: https://joelhooks.com/digital-garden
[wycash]: http://c2.com/doc/oopsla92.html

## Chapter 1: Multi-Currency Money

Unfortunately, **TDD By Example** leads off with the same premise that every other TDD guide does: The premise that the reader is relatively new to coding. [[2021/the-mistake-every-tdd-tutorial-makes | This is a pet-peeve of mine]]. I've tried on several occasions to learn TDD and been chased away by just how inane and inefficient it's made to look by starting from first principles. _If you wish to write software with TDD, you must first invent the universe._

Obviously-failing-tests-failing-obviously aside (confused? read my rant on [[2021/the-mistake-every-tdd-tutorial-makes | the mistake that every TDD tutorial makes]]), I did actually learn something from the first chapter.

In addition to red/green/refactor, you'll also commonly see these as the steps of TDD (copied here from chapter 1):

1. Add a little test
1. Run all tests and fail
1. Make a little change
1. Run the tests and succeed
1. Refactor to remove duplication

Upon first encountering this list, I couldn't fathom what sort of duplication might exist. The whole point of this process is to test so fervently-tiny a component, how could we possibly have duplicated anything?

As it turns out, the duplication in question &mdash;at least for the purposes of chapter 1&mdash; is between the (naïve) implementation and the (naïve) test. Duplication between the test and the implementation is an indicator that the implementation is incomplete. Something is hard-coded. The book updates the implementation to the following:

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

At this point the test passes and the implementation code resembles the 124 characters I probably would have started with in the first place before ever running the first test. And when I did write that test, I would, less-naïvely, have included two different math assertions to prove that the tests weren't passing because of any hard-coded values.

```java
public void testMultiplication(){
	Dollar five = new Dollar(5);
	five.times(2);
	assertEquals(10, five.amount);
	five.times(3);
	assertEquals(30, five.amount);
}
```

This raises the question of immutability, but I'm sure we'll get to that.

I suppose the point of all of this is to illustrate the steps that you should follow **when the problem is one that you can't solve in your head**.

1. First make a test that, when it passes, will prove that your feature works as expected. This is part of what upsets me about the initial test case: only testing 1 set of inputs doesn't fully prove the feature works; only that you are capable of understanding how the test works.
1. Then iterate on the application to make the test pass, committing whatever sins of ["Clean Code"][cleancode] are necessary to get there.
1. Once you're satisfied that the code actually works and the test actually proves the code works, refactor the code to be "Clean" while still passing the entire suite of tests to prove that you haven't broken anything else in the process.

[cleancode]: https://workingcode.dev/episodes/022-book-club-1-clean-code-by-uncle-bob-martin-pt1/

## Chapter 2: Degenerate Objects

Chapter 2 identifies and resolves another code smell: the immutability concern I raised near the end of my notes on Chapter 1. We're seeing the refactoring process at work, but there's not much going on here. We're still in the neighborhood of obviousness.

But it also validates my complaints about chapter 1 and about TDD guides in general: If there's an obvious implementation, use it!

> "When I use TDD in practice, I commonly shift between these two modes of implementation [Fake it vs. Use Obvious Implementation]. When everything is going smoothly and I know what to type, I put in Obvious Implementation after Obvious Implementation."

It's nice to see this somewhat early in the book, but considering that the preface and introduction are both strongly recommended reading and both full-chapter-length, this is basically in chapter 4.

## Chapter 3: Equality for All

Here we're starting to see the todo list in action as we add both `equals()` and `hashCode()` as items to come back to, and then we start writing a test for the former. I would have sworn there was a note somewhere early on (introduction? preface? chapter 1?) about some helpful tips coming for the todo list, but so far I'm not seeing anything aside from "use one." For lack of a better place, I mentally picture it as a comment at the top of the tests file with a heading of "TODO."

"Triangulation" is presented as a technique of adding multiple assertions to help clarify what the right implementation should be if you're unsure. Sound familiar? That's what I was suggesting in my chapter 1 notes as table-stakes for all tests. I think if you're only doing 1 assertion per test you can't be sure that the code _actually works_ can you? Ah well, at least this was a familiar technique.
