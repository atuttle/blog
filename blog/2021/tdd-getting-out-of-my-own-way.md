---
title: 'TDD: Getting Out of My Own Way'
summary: 'I was stuck on TDD because I wouldn''t let myself do the obvious thing.'
date: 2021-05-27
tags:
  - learning in public
  - javascript
  - tdd
commentsPostId: tdd-getting-out-of-my-own-way
---

Yesterday I wrote about how I was [trying to do TDD for a JavaScript project but I got stuck][stuck]. I'm not stuck any more, thanks to a comment left by [Michael Sprague][ms].

Here's the thing. **I wasn't stuck on something technical.** And that makes it all the more embarassing that I had spent half of my workday trying to get past it.

I was stuck on something philosophical. I didn't want to do the obvious thing because it seemed messy, which would be <acronym title="at a right angle to; at odds with">orthogonal</acronym> to ["Clean Code"][cc]. I recently read Uncle Bob's infamous tome and it felt wrong to intentionally write code that I knew I didn't like.

![A van stuck in the mud](/img/2021/stuck.jpg)

I was forgetting that, "Good code isn't written, it's refactored." This is something that my podcast cohost Ben recently quoted from [the last episode of The Bike Shed podcast][tbs]. I should get this phrase tattoed backwards on my forehead so that I have to look at it in the mirror while I'm brushing my teeth every day.

To recap, I had a module with a helper function that I wanted to be able to test in isolation. I wanted my module to export only the main function, and I found the idea of creating a separate module for the helper function unappealing because I thought that establishing this pattern would result in the number of helper function modules spiraling beyond all bounds of reasonability in no time flat.

**Node.js has a solution for this problem.** Modules can export a map (or strucure/object, if you prefer) and those maps can have as many properties and methods as you like. In tutorials you so often see these simply called `utils.js` or `helpers.js`.

I have grown to _hate_ that approach to module naming. It feels lazy to me. Like naming a variable `myVar`. My lizard brain criticizes, _If you weren't so lazy, you could actually come up with a useful and helpful name for that variable/module._ And worse yet, given 10 seconds, I couldn't come up with a useful name for a collection of helpers for my module.

I had two obvious solutions in front of me, and I was subconsciously avoiding both of them.

I could either create an extra module for my helper methods to live in, or I could give up my arbitrary _"I only want this module to export its public api"_ requirement. Either solution would make the helper methods testable and available to my module without proliferating a billion tiny modules.

Why was I fighting so hard against the idea of a billion tiny modules? Isn't that one of the supposed strengths of Node.js? Well, yes and no. Imagine a system with (more realistically) 2,000 helper function modules. Now you need to find the one that you think has a bug in it. Where is it? It's probably in a messy folder with 1,999 of its friends, right?

In my opinion, the "billions of tiny modules" approach is still possible to accomplish cleanly, but it would necessitate extreme care in naming and organization in order to be clean. Naming things is one of the hardest problems in programming, right? That's a lot of cognitive load that you could spend elsewhere if you didn't have to do it. And with modern IDE's finding things isn't that hard. But what remains hard is that for every new helper-function-module you create you then have to take the time to name it well and put it in a logical place within your project, a couple of time penalties that I'd rather avoid if I can.

But more importantly, I was resisting the urge to create individual helper modules or helper function group modules because I was trying to hold myself to a minimum standard of "purity" during the writing process. But as I so deftly demonstrated &mdash; I got stuck on literally the first test I tried to write! &mdash; that is not a productive line of thinking. I'm probably very poorly cribbing this from **Clean Code** or some smart person on Twitter or something, but I think of the steps of writing good code as:

1. write the code
2. make it work
3. make it correct
4. make it fast (enough)
5. make it clean

There's no sense focusing on code cleanliness during step 1, because it's going to be refactored several times anyway, and cleanliness can be refactored in later.

I expect that I will get better at the "brainstorming" phase of coding as part of the TDD process with more practice. At the moment, the two goals sometimes feel antithetical to one another.

---

I ended yesterday's article saying that I had no choice but to set aside my TDD goals and press forward on the project &mdash; at least until I had the testing stuff figured out (running in a parallel mental thread).

So I did that. And I made quite a lot of progress on my project, and now the code is pretty far ahead of the tests. And some choices I made along the way are definitely going to need to be refactored to make them more testable, and cleaner. And that's ok.


[stuck]: https://adamtuttle.codes/blog/2021/lip-writing-testable-nodejs-code/
[ms]: https://m5ls5e.com
[cc]: https://workingcode.dev/episodes/022-book-club-1-clean-code-by-uncle-bob-martin-pt1/
[tbs]: https://www.bikeshed.fm/294
