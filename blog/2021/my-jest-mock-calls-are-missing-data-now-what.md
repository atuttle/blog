---
title: My Jest Mock Calls Are Missing Data. Now What?
desc: Let me save you some time. I spent hours debugging this and another 20 minutes writing up a draft Stack Overflow question before the answer came to me.
img: /img/2021/dumbbell.jpg
date: 2021-06-03
tags:
  - learning in public
  - testing
  - jest
  - async
commentsPostId: jest-mock-calls-missing-data-now-what
---

Yesterday I had an altogether too familiar experience. I spent several hours debugging, and once I believed that the answer was beyond me, I started drafting an explanation and code samples that would eventually become a Stack Overflow question. After 20 minutes of explaining the problem to my hypothetical Stack Overflow helpers, the answer came to me.

https://twitter.com/AdamTuttle/status/1400201226625691652

I've already spoiled the solution above, but what was the problem, and how can I share that knowledge in a way to help others who might run into the same situation?

- I'm using [Jest][jest] for testing some JavaScript code
- The code uses fetch to make HTTP requests, and I'm mocking fetch to make those requests controllable and fast
- It appeared that fetch requests _that I knew were happening!_ weren't showing up in the `fetch.mock.calls` array.

Wait, what? How can I know that the calls were made and also not see them in the `fetch.mock.calls` array?

Well, my mock looks like this:

```js/1
fetch.mockResponse(async (req) => {
  console.log(req.url);
  if (req.url === '...') {
    return JSON.stringify( /* ... */ );
  }
});
```

As my test ran, I could see about half a dozen HTTP requests logged by the `console.log` statement. Ok, great, but...

```js/3
const thingDoer = require('./thingDoer');
it('does the thing', () => {
  thingDoer();
  console.log(fetch.mock.calls);
  expect(fetch).toHaveBeenCalledWith( /* ... */ );
});
```

How is it, then, that the `console.log` in the test shows only 1 call in the array?!

Well, maybe you've already guessed it from the spoiler in the tweet, but the answer was as simple as a missing `await`. Specifically, the `thingDoer` method is async and returns a promise.

Since I wasn't awaiting that promise, `thingDoer` returned early and I was running my `console.log` and expectations _while it was still running_. That explains why the log of `fetch.mock.calls` had less data than I could see in the individual logs for each request... they hadn't been made **yet**.

Making my test async and awaiting `thingDoer` solved it.

```js/2
const thingDoer = require('./thingDoer');
it('does the thing', async () => {
  await thingDoer();
  expect(fetch).toHaveBeenCalledWith( /* ... */ );
});
```

Hopefully this helps someone else out there going nuts because things that they can see happening aren't in the list of things that happened. But let's be realistic. It'll be me referring to this article again in 9 months. 🤷‍♂️

[jest]: https://jestjs.io
