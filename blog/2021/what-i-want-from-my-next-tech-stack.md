---
title: What I Want From My Next Tech Stack
desc: What is the ideal tech stack in 2021? Thoughts on goals and options.
img: /img/2021/alex-andrew-eowPn9R8Pt0-unsplash.jpg
date: 2021-05-11
tags:
  - my next tech stack
---

I've been working on the web full time since 2005, part time since 2000, and for fun since 1997, and the vast majority of that was writing CFML ("ColdFusion"). A handful of years ago I decided I was done investing my energy into CFML and that I wanted to move on to something else. Whether or not I was a "big fish," CFML is undeniably a small pond, and I felt a calling to a larger pond.

The most logical next place for me seems to be full-stack JavaScript. It's been 8+ years that I've been comfortable using Node.js, but not doing it as my mainstay. I often have my fingers in AWS Lambda (always Node.js); I've written several tools, microservices, and dashboards using vanilla React and a few with Next.js; and I've dabbled with Gatsby and Eleventy.

And yet on average I _still_ write _at least_ an order of magnitude more CFML than JavaScript on any given day. But now more than ever I can see that the sun is setting on CFML in my career. [My team](https://www.alumniq.com) is growing, we all agree that CFML's days in our stack are numbered, and we are taking steps to migrate away from it. We have been taking these steps for almost a year now. Migrating big apps takes a _long time_.

## What does the future hold?

As we start to look toward the future I can't help but feel that there are no good (public) examples of how to organize a _**truly large**_ React.js application. [There is zero content on this subject on egghead.io](https://egghead.io/q/javascript?q=organize). I am intrigued by the idea of [Remix](https://remix.run), but it's too young and I'm not willing to bet the farm on it yet. The most obvious choice seems to be Next.js.

I have a bunch of experience writing Next apps, and I certainly find a lot to like about them, but something I've never quite figured out is how to organize them for large-scale applications. Thinking about that recently, I decided it might be helpful to write down my goals for our tech stack after we leave CFML behind. So in no particular order, here's what I'm looking for:

- A healthy testing ecosystem: lots of tools to choose from, tests (can) run fast
- File-system based routing, which I think helps keep the code organized
- Turn-key bundling and code-splitting, and other similar optimizations (don't make me configure webpack, but let me tweak it if I want to)
- Good integration options for GraphQL
- Fast application startup time

There are other things that we'll get from other aspects of the stack, like: Automated zero-downtime deploys with support for fast rollbacks, which we'll get from ECS Fargate, but I'm scoping this article to the programming language/platform/framework.

That's all I can think of for the moment, and I think that most of those boxes are easily checked by JavaScript and Next.js, which is why I said it seemed like an obvious choice. While it does have file-system based routing, one issue that I still struggle with in Next applications is organizing files.

## Organizing large Next.js apps

Next apps have a `pages/` directory where each route ("page") is defined.

```js
pages/
  index.js
  login.js
  dashboard.js
  users/
    index.js
    edit.js
  reports/
    a.js
    b.js
    c.js
    ...
  marketing/
    index.js
    lists/
      index.js
      search.js
      edit.js
    messages/
      index.js
      calendar.js
      edit.js
      activity.js
```

Each of these JS files defines a Page, but don't forget that we're talking about React.js and so each page is broken down into at least a few, and possibly hundreds of reusable and shared components. The interlocking components aspect of React is fantastic and one of the reasons that I love it so much, but where do they go?

One nice thing about Next.js is that they let you create aliases for import/require statements, so that you can change this:

```js
import MessageGrid from '../../../../../components/marketing/messages/grid.js';
```

Into something that more closely resembles this:

```js
import MessageGrid from 'marketing-components/messages/grid.js';
```

This is undeniably an improvement, but is it good enough? I don't know.

If the listing above was my entire application, then maybe. But it's not. My application is a Monolith with [a few microservices refactored out](https://workingcode.dev/episodes/005-monoliths-vs-microservices/) when it made sense to do so, and that monolith has over a thousand actions that can be executed; with somewhere around half of them having views (think 800 screens with views and another 400 form-submit handlers; that'll get you close enough).

Hopefully it's obvious why I'm a little uneasy about this organizational structure, now? With so much functionality wrapped up into our application, colocation of our components next to the pages that use them —when specific to that portion of the application— will greatly increase maintainability. Hunting down a component location is no fun; but let's be realistic: JavaScript tooling is good enough now that you won't have to hunt for an existing component. Option+Click (or I guess Ctrl+Click for Windows devs) on it in VSCode and it will open the file for you. I'm not sure if this is true with the Next.js aliasing thing, though. 🤔

The other side of this same coin: Option+Click can't help you find the right folder in which to create the new component you need for the page you're working on. Colocation would be ideal. And all of this is to say nothing of the tests. My preference would be to colocate the tests with the pages, too.

Is this a solved problem? Just like there's no egghead content on the subject, there is [a curious lack of content on the Next.js discussion forum, too](https://github.com/vercel/next.js/discussions?discussions_q=organize). The first thing that comes to my mind is a file naming convention. For example, it's common to see `foo.spec.js` for a file that runs tests on the `foo.js` component. Perhaps there's something like `gridview.comp.js` that tells Next that the file is not a Page, even though it lives nested somewhere inside the `pages/` directory. There's a lot of really smart people at Vercel and they seem to work at a relentless pace, so I won't be surprised if/when they come up with something better than that.

## Looking at it from another angle

Another question I'm asking myself is if I'm looking at this the wrong way. Yes, my current monolith envelops all of its "modules" (mail, marketing, merch, membership, and that's just the M's...) because that makes sense on its current tech stack, but in a Next.js future, does it make more sense to break them up into separate apps for each module and run each one individually?

I can see some benefits: Being able to work on and deploy them individually reduces opportunities for developers to get in each other's way, merge conflicts, and the like. And on the rare occasion that a catastrophic bug crashes the app, it's only the one module. But I can also see some drawbacks: Each module would need to have its own ECS service, and our total minimum number of running containers, even with absolutely zero traffic, would be one for each module; versus the monolith that could theoretically scale down to a single instance.

## This is only the beginning

At any rate, this is a journey. I intend to find out the answers to these questions and I'll be sure to share what I find. If you're interested in big JavaScript apps too, maybe stick around.
