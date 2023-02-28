---
title: My theory of technical debt (It's the business' fault)
desc: If we're professional software engineers, why aren't we acting like professionals?
img: /img/2023/hunters-race-MYbhN8KaaEc-unsplash.jpg
date: 2023-03-30
tags:
  - technical debt
  - software craftsmanship
---

![An old fashioned metal key](/img/2023/hunters-race-MYbhN8KaaEc-unsplash.jpg)
Photo by <a href="https://unsplash.com/@huntersrace?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Hunters Race</a> on <a href="https://unsplash.com/photos/MYbhN8KaaEc?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>{class="photo-byline"}

## How to write good software

It's not _dark science_ or _rocket surgery_ to write decent software. You can get lucky and slap something together that works on the first try and never has problems, but you can't count on that luck to last your entire career. The good news is that there's a consistent and predictable way to write good software.

1. Decide what feature needs to be written. If complexity necessitates, write a specification.
2. Write tests that will validate when you've reached the goal. When the tests pass, stop working. If your tests are passing and you know there's more features to add or more edge cases to handle, then you need to add more failing tests first.
3. Write the code that makes the tests pass, ignoring best practices.
4. Refactor the code to follow all of those best practices you ignored in the last step. Fortunately you have the tests to give you confidence that you haven't broken anything!
   1. Remove duplication
   1. Employ [SOLID principles](https://en.wikipedia.org/wiki/SOLID)
   1. Make it readable for the developer who has to debug it in 10 years and doesn't know what you're thinking today. It might be you. Or it might not be.[^1]
   1. etc...
5. Submit for code review, and incorporate feedback as appropriate.

[^1]: "Always code as if the guy who ends up maintaining your code will be a violent psychopath who knows where you live. Code for readability." - [John Woods](https://stackoverflow.com/a/878436/751)

## Then, why is there always so much technical debt?

**My theory is that we allow "the business" to get in the way of doing our jobs well.**

Too often, software companies and IT departments are given a project mandate and an allowable time limit to spend working on it. Maybe they talked to customers about it, decided it would be a valuable project, and the customer would need it by a certain date in order to be able to use it.

That's the wrong way to think about it.

Even if we are diligent about only working on the parts that _really must be included_ and not getting sidetracked by things that are interesting, the phrase "it'll be done when it's done" is still right; regardless of whether the business wants it done in 3 months or 3 weeks.

So you've accepted a project, and an unrealistic timeline. Now what?

Well, you can't skip step 3, you've got to write the code. And step 5 (code review) seems like it could be a good safeguard against the problems that steps 1 (specification) and 2 (tests) protect you from (if people were perfect at code reviews, _which..._). And step 4 (refactoring)? You think the business is going to let you take code that's already working make it "better" without making any functional changes? That's going to go right out the window.

What's left?

1. Write code
2. Get a code review

_Sound familiar?_

I bet it does.

Skipping those steps is where technical debt comes from.

\* \* \*{style="text-align:center"}

What if you had to sign a form stating that your code is engineered correctly and safe to go into production, and that you may be held personally responsible if it breaks and causes financial, reputational, or other realizable harm to the business?

Aside from quitting, what would you do?

\* \* \*{style="text-align:center"}

Would an architect allow her design to move on to construction without confidence that the specified girders can hold the weight of the building and all of the people and equipment it will one day need to hold? Not one who wants to keep her license.

Would a construction site engineer allow the building to start going up before the foundation is complete? Not one who wants to keep her job.

These aren't perfect metaphors, probably mostly because I don't know the first thing about architecture or construction. But my point is that these jobs are more than jobs, they're professions.

You're not the guy who puts the sour cream on the tacos when they land in front of you, you're a professional, dammit. Act like one.

\* \* \*{style="text-align:center"}

Your job isn't to translate the human-readable specification into computer-readable code. It's to be a software engineer. When an architect or an engineer tells their customer that the request can't be completed in the given time, the customer will accept that and find other ways to make their building schedule work, or they'll have to find another architect or engineer.

If you know you're not being given enough time to complete the project well, refuse to sign the paperwork that says that you can be held responsible for failure, because you know it inevitably will.

Of course, we're not expected to sign documents like that. So what does the metaphorical signature-refusal look like in the real world?

Explain to the business that good work takes time and you can't arbitrarily decide it needs to be done faster. You can't just pour concrete mix into a hole and move on to scaffolding up the building.

Ask them: do they want a hack thrown together by a team of under-slept coffee addicts whose nerves are shot from the on-call alarm buzzing constantly, or do they want the right solution, engineered properly to support the business in its activities and for the concept that there's software making the business possible (dare I say easy) to be invisible?

\* \* \*{style="text-align:center"}

I am far from the first to champion the concept of "[Appetite](https://37signals.com/seven-shipping-principles#appetite)"[^2] in software planning.

[^2]: I am not a fan of DHH / 37Signals, but this was the first place I became aware of the concept. Credit where it's due, I guess.

The short version is that if the timeline must be fixed, then the scope must be flexible. If there's not enough time to do the software engineering right, and to get it all done, then features have to start getting dropped. Start with the most important features, and be ruthless about cutting things.

You can have a fixed scope, or a fixed timeline, but not both.

Prevention is the best cure, and that's what I'm championing here. If we as an industry start standing up for ourselves and enforce the right way of doing our jobs, then future technical debt can be minimized if not avoided entirely. And we can get some sleep, too!

### But what about pre-existing technical debt?

I am a big fan of [framing technical debt as "maintenance load"](https://stackoverflow.blog/2023/02/27/stop-saying-technical-debt/). It helps the business understand the true cost of technical debt: If your maintenance load is 50% then a 6 week project will take 12 weeks to complete. It also gives us, the engineers, a concrete objective to battle against. Identifying specific sources of maintenance load and reducing or eliminating them will (**measurably!**) improve the lives of the whole team, allow the department to ship projects faster, and help the business do... business things... better.[^3]

[^3]: I am so good at wording.

### Estimating: The Footgun of Software Engineering

I don't have any silver bullets (yet?) for doing better at estimating, but I acknowledge that not every project is brought down from the mountain with a requirements doc and an unrealistic deadline pre-attached. Sometimes we estimate ourselves into this situation, and in those cases we have only ourselves to blame.

I've heard people say that they come up with their estimation, and then they double or triple it, and give that as the actual estimation, to cover anything they haven't thought of. That's one way to do it, though probably imprecise.

I think it's more likely that we just forget to think about planning, testing, refactoring, and code review when we make estimations, because writing code quickly can be a point of pride. _You need 4 weeks to write that? I could do it in 2!_ But never in the history of ever has _I could do it in 2!_ guy been thinking about planning, testing, refactoring and code review when he gives that number.

Don't be that guy.
