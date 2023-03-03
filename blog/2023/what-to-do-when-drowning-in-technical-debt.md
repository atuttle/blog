---
title: What to Do When You’re Drowning in Tech Debt
desc: An explanation of how to frame the discussion so that the business sees value in reducing and preventing technical debt.
img: /img/2023/hunters-race-MYbhN8KaaEc-unsplash.jpg
date: 2023-03-03
tags:
  - technical debt
  - software craftsmanship
---

![An old fashioned metal key](/img/2023/hunters-race-MYbhN8KaaEc-unsplash.jpg)
Photo by <a href="https://unsplash.com/@huntersrace?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Hunters Race</a> on <a href="https://unsplash.com/photos/MYbhN8KaaEc?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>{class="photo-byline"}

## Where does it come from?

It's not _dark science_ or _rocket surgery_ to write decent software. You can get lucky and slap something together that works on the first try and never has problems, but you can't count on that luck to last your entire career. The good news is that there's a consistent and predictable way to write good software.

1. Decide what feature needs to be written. If complexity necessitates, write a specification.
2. Write tests that will validate when you've reached the goal. When the tests pass, stop working. If your tests are passing and you know there's more features to add or more edge cases to handle, then you need to add more failing tests first.[^0]
3. Write the code that makes the tests pass, ignoring best practices &ndash; get to passing tests as quick and dirty as you can!
4. Refactor the code to follow all of those best practices you ignored in the last step. Fortunately you now have the tests to give you confidence that you haven't broken anything during your refactoring.
   - Remove duplication
   - Employ [SOLID principles](https://en.wikipedia.org/wiki/SOLID)
   - Make it readable for the developer who has to debug it in 10 years and doesn't know what you're thinking today. It might not be you.[^1]
   - etc...
5. Submit for code review, and incorporate feedback as appropriate.

[^0]: It is a legitimate strategy to write a prototype of the feature first before you write tests if you don't yet understand what it will take to implement the feature. You can't test something you don't understand, so write a throw-away prototype to learn from, then throw it away, and write your tests for the real implementation.
[^1]: "Always code as if the guy who ends up maintaining your code will be a violent psychopath who knows where you live. Code for readability." - [John Woods](https://stackoverflow.com/a/878436/751)

### Then, why is there always so much technical debt?

**I believe that we allow "the business" to get in the way of doing our jobs well.**

Too often, software companies and IT departments are given a project mandate and an allowable time limit to spend working on it. Maybe the CEO talked to customers about it, decided it would be a valuable project, and the customer would need it by a certain date in order to be able to use it.

That's the wrong way to think about it.

Even if we are diligent about only working on the parts that _really must be included_ and not getting sidetracked by things that are interesting, the phrase "it'll be done when it's done" is still right; regardless of whether the business wants it done in 3 months or 3 weeks.

So you've accepted a project, and an unrealistic timeline. Now what happens?

Well, you can't skip step 3, you've got to write the code. And step 5 (code review) seems like it could be a good safeguard against the problems that steps 1 (specification) and 2 (tests) protect you from, and code review tends to take a lot less time the writing a spec and tests. And step 4 (refactoring)? You think the business is going to let you take code that's already working make it "better" without making any functional changes? That's going to go right out the window.

What's left?

1. Write code
2. Get a code review

Sound familiar? I bet it does.

**Skipping those steps is where technical debt is born.**

### Professional Responsibility

What if you had to sign a document stating that your code is engineered correctly and safe to go into production, and that you may be held personally responsible if it breaks and causes financial, reputational, or other realizable harm to the business? This is not that far off from the responsibility that architects and construction site engineers bear.

Would an architect allow her design to move on to construction without confidence that the specified girders can hold the weight of the building and all of the people and equipment it will one day need to hold? Not one who wants to keep her license.

Would a construction site engineer allow the building to start going up before the foundation is complete? Not one who wants to keep her job.

These aren't perfect metaphors, probably mostly because I don't know the first thing about architecture or construction. But my point is that these jobs are more than jobs, they're professions.

You're not the guy who puts the sour cream on the tacos when they land in front of you, you're a professional, dammit. Act like one.

\* \* \*{style="text-align:center"}

Your job isn't to translate the human-readable specification into computer-readable code. It's to be a software engineer. When an architect or an engineer tells their customer that the request can't be completed safely in the given time, the customer will accept that and find other ways to make their building schedule work, or they'll have to find another architect or engineer.

The Archictects and Site Engineers _are_ responsible, and they _will_ be held accountable if the building crumbles.

Everyone acknowledges safety is important. Shouldn't it be important in business software, too?

If you know you're not being given enough time to complete the project well, refuse to sign the paperwork that says that you can be held responsible for failure, because you know it inevitably will fail.

Of course, we're not expected to sign documents like that. So what does the metaphorical signature-refusal look like in the real world?

Explain to the business that good work takes time and you can't arbitrarily decide it needs to be done faster. You can't skip the tests and expect robust software, just like you can't pour dry concrete mix into a hole and hope that the rain will soak the concrete and cure before its strength is needed. If you want a reliable product, there are steps you can't skip.

Do they want a hack thrown together by a team of under-slept coffee addicts whose nerves are shot from the on-call alarm buzzing constantly, or do they want the right solution, engineered properly to support the business in its activities and for the concept that there's software making the business possible (dare I say easy) to be invisible?

\* \* \*{style="text-align:center"}

I am of course championing the concept of [Appetite](https://37signals.com/seven-shipping-principles#appetite) in software planning.[^2]

[^2]: I am not a fan of DHH / 37Signals, but this was the first place I became aware of the concept. Credit where it's due, I guess.

The short version is that if the timeline must be fixed, then the scope must be flexible. If there's not enough time to do the software engineering right, and to get it all done, then features have to start getting dropped. Start with the most important features, and be ruthless about cutting things.

You can have a fixed scope, or a fixed timeline, but not both.

### Step 1: Stop the bleeding

You'll never escape from technical debt if you don't slow down its creation.

An ounce of prevention is worth a pound of cure. If we as an industry start standing up for ourselves and enforce the right way of doing our jobs, then future technical debt can be minimized if not avoided entirely. And we can get some sleep, too!

Truth be told, I don't think most businesses will have an appreciation for technical debt until they're being told it's what's causing their developers to move more slowly than they expected. Sometimes you have to suffer a little bit before you're willing to invest in the process. Which brings us nicely to existing tech debt.

### What about pre-existing tech debt?

I am a big fan of [framing technical debt as "maintenance load."](https://stackoverflow.blog/2023/02/27/stop-saying-technical-debt/) It helps the business understand the true cost of technical debt: If your maintenance load is 50% then a 6 week project will take 12 weeks to complete. It also gives us, the engineers, a concrete objective to battle against. Identifying specific sources of maintenance load and reducing or eliminating them will (**measurably!**) improve the lives of the whole team, allow the department to ship projects faster, and help the business do... business things... better.[^3]

It could be a difficult conversation, but if you frame it as something concrete, and you bring actual metrics to the table to show the sources and cost of your current maintenance load, then you can have a real discussion about what can be done to reduce it and prevent it going forward.

The business doesn't want to give you 3 weeks to make the software "better" without adding any new features, but spending 3 weeks to invest in shipping future projects faster, when framed in maintenance load terms, can be seen as a win even in their non-technical eyes.

[^3]: I am so good at wording.

### Estimating: The Footgun of Software Engineering

I acknowledge that not every project is brought down from the mountain with a requirements doc and an unrealistic deadline pre-attached. Sometimes we estimate ourselves into this situation, and in those cases we have only ourselves to blame. I don't have any silver bullets (yet?) for doing better at estimating, but here are some thoughts to get you started.

I've heard people say that they come up with their estimation, and then they double or triple it, and give that as the actual estimation, to cover anything they haven't thought of. That's one way to do it, though probably imprecise.

I think it's more likely that we just forget to think about planning, testing, refactoring, and code review &mdash;and edge-cases!&mdash; when we make estimations, because writing code quickly can be a point of pride. _You need 4 weeks to write that? I could do it in 2!_ But never in the history of ever has _I could do it in 2!_ guy been thinking about planning, testing, refactoring, edge-cases, and code review when he gives that number.

Don't be that guy.
