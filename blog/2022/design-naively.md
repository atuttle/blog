---
title: Design Naïvely
desc: What exactly does it mean to avoid premature optimization?
img: /img/2022/timo-volz-9Psb5Q1TLD4-unsplash.jpg
date: 2022-02-10
tags:
  - architecture
  - best practices
---

![A very complex intersection seen from a high vantage point](/img/2022/timo-volz-9Psb5Q1TLD4-unsplash.jpg)

Photo by <a href="https://unsplash.com/@magict1911?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Timo Volz</a> on <a href="https://unsplash.com/s/photos/complex?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>{class="photo-byline"}

What exactly does it mean to avoid premature optimization when writing software?

When building a new town from scratch, don't plan for hi-rise buildings, complex freeway interchanges and underground mass transit lines. Start with the buildings and roads and parking lots that will attract people to your new town.

Which is worse?

- Spending 2x-3x the initial investment of time and money to demolish and rebuild infrastructure to support the town as it grows
- Spending 20x the minimal investment of time and money to build a city that could support a thriving community of thousands, but nobody shows up

Build just enough of your application to say you have the feature.

Do it the easy way.

Don't care that it won't work if you achieve Facebook-activity-level scale. That level of activity almost never shows up overnight.

Odds are good that you'll never need to.

And that's a good thing.

It freed you up to spend more time building more new ideas (naïvely). The more you build, the more likely one of those ideas is to find success.

So put it in the monolith. Use algorithms that are easy to implement. Avoid complex workflows like message queues and service busses.

Watch activity logs. Measure performance. When, _**and only when**_ you're spending less time fixing bugs and adding features than you are on holding the application's hand so that it can finish the computationally-expensive processes, and/or when those processes become critical-path to the success of your business, that's when you invest time and money in them to add complexity and support the increased demand.
