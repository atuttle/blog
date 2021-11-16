---
title: Is TDD Right For Me?
desc: On my journey to get better at testing I've been learning about TDD. But I'm starting to wonder if TDD is universally the 'best' design process.
img: https://adamtuttle.codes/img/2021/joshua-j-cotten-7ZppYEoBNhQ-unsplash.jpg
date: 2021-10-27
tags:
  - testing
  - tdd
commentsPostId: is-tdd-right-for-me
---

![A confused bird on a hummingbird feeder](/img/2021/joshua-j-cotten-7ZppYEoBNhQ-unsplash.jpg)

Photo by <a href="https://unsplash.com/@jcotten?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Joshua J. Cotten</a> on <a href="https://unsplash.com/s/photos/unsure?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>{class="photo-byline"}

I believe in automated testing.

I believe that automated testing is table-stakes for professional software development of any kind &ndash; I just so happen to focus on the web these days.

I believe that if you don't have decent automated tests for your code, you're behind and playing catch-up, or at worst, waiting for a piano to drop on you from above. _This applies to most of my code, so if I'm calling anyone out, it's me._

I am [in the process of reading][reading] what I understand to be the TDD bible: "TDD By Example" by Kent Beck. (Yeah, I'm way behind schedule. Sorry.)

Amongst the many things I do every week, testing seems to come up with extreme regularity. If I'm not discussing it on [my podcast][wc] then I'm writing tests at work and focusing on honing that skill or &mdash;most often&mdash; discussing aspects of it in [the podcast discord][discord]. There's a certain person there who fancies himself competent at TDD, and certainly he's better than me, so I try to learn what I can from him by sending him my random thoughts and questions to see what he makes of them.

I'm pretty sure that's what inspired his post [TDD is not a testing strategy][nottesting], in which he frustratedly explains TDD is a method for _designing software_, not for _writing tests_.

This is difficult for me because I have been writing software professionally (getting paid for it) since roughly 1998-1999. I'll do the math for you: that's well over 20 years. **And while I had heard of automated testing occasionally in my career, not a single employer, project manager, team lead, or mentor along the way stressed the importance of TDD or even automated testing for that matter.** Which brings me to today.

Please allow me a moment of hubris: I am reasonably f\*\*\*n' good at my job.[^1]

An average project for me in the last 10 years consists of a simple request for a feature addition, perhaps as compared to an existing feature in a different part of our product but different in some way, and most often a request for me to determine the amount of time I need to complete it. Not often, but sometimes the deadline is pre-determined, and I've become quite adept at the conversation about which features need to be kept and which can get tossed overboard at the last minute in order to ship on time if I can't get them done. That's a different topic altogether.

I specifically wanted to point out that I often get to dictate the timeline, because that's so often an excuse for lack of testing. I don't have that excuse.[^2]

Because I have 20 years of experience in developing software from minimal specifications and meeting management and customer expectations, and having done so without using TDD as a method to _design_ that software, I have developed an ability to near-instantly start to understand how I will break the problem down and implement it (in broad strokes, at least) the moment it is asked of me.

90% of web development is accepting inputs (form, url), reading/writing against a database, and spitting some data out on a resulting page. That doesn't take a rocket surgery degree. It's not hard to predict where the breakpoints between view, controller, service, and DAO will be; nor what sorts of tasks will be done in each spot. All that's left to do is:

- Name the methods
- Define the method signatures (what arguments do they take and what do they return?)
- Implement the body of those methods, recursing as necessary to refactor out complex or reusable bits of code
- Display the results in a way that's meaningful to the humans that will be using it

That sounds an awful lot like what I'd expect to see in a specification document, if I ever got one of those. You might think I should take a few moments to put those thoughts down in writing before I begin, and boom, there's your spec. But therein lies the rub.

I always dive in and start coding with some assumptions about what the method signature should be (what I would have written down in the spec), and often as I'm writing the implementation I realize that I hadn't thought about certain parts of the problem fully, and as a result I need to add another argument, or change the type of an existing argument. I traverse up and down the stack from view to controller to service and DAO and back again, continuously, rapidly evolving the functionality, method signatures, view contents, etc. Usually my physical ability to navigate the code and type the changes is the limiting factor &mdash; I can think of the changes a heck of a lot faster than I can make them.

The code often evolves so much during this process that it barely resembles the original (mental) specification at all by the end.

Maybe this sounds awful to you. That's fine. I'm not here to yuck your yum or to claim that TDD is somehow bad or wrong.

But you know what? This process works _fantastically_ for me. I hope that nobody would be so bold to claim that "TDD is the only correct way to design software," but if they did I would disagree. I think that if the goal is to take certain inputs ("we need this feature, it should be kinda like that other feature, but different in XYZ way..."), and produce software that satisfies that need, then there's multiple ways to get there.

That tests are a byproduct of TDD would be nice, but if it's faster and easier for me to add them after the fact, I don't think that somehow makes my approach "wrong."

Anyway, I'm still going to [finish reading TDD By Example][reading][^3], and I am completely open to having my mind changed. It's just that I am starting to realize that TDD may not be a universally "best" design process. In some ways, this is my way of giving myself permission to choose not to follow TDD after I finish the book.

[^1]: Except for that whole not much testing thing...
[^2]: Purists would argue that nobody has that excuse because the tests should be the absolute last thing you throw overboard to meet the deadline, and if you don't have time to test then you don't have time to write the feature... But again, I'm not making that argument. I mostly set my own timelines.
[^3]: Some day, presumably.

[reading]: https://adamtuttle.codes/blog/2021/tdd-by-example-kent-beck/
[wc]: https://workingcode.dev
[discord]: https://workingcode.dev/discord
[nottesting]: https://blog.adamcameron.me/2021/04/tdd-is-not-testing-strategy.html
