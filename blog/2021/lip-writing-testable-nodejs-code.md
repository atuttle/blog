---
title: 'LIP: Writing Testable Node.js Code'
summary: 'I''m stuck on a TDD JS issue, so here are the details.'
date: 2021-05-27
tags:
  - learning in public
  - javascript
commentsPostId: lip-writing-testable-nodejs-code
---

Yesterday I was trying to <acronym title="Test Driven Development">TDD</acronym> some Node.js code, and I got stuck. I asked for help on the [KCD Discord][kcdd]\* but I guess my explanation of the problem wasn't great, so I promised I would follow up with a repro case. Meanwhile I am also trying to do better at [learning in public][lip], so I'm going to write about it here, too. So here we go.

I am working on an AWS Lambda service that will run on a schedule and process some data. It will be written in Node.js. Node Lambda functions define a starting point file that exports an object containing a function. I think the convention is `index.js` and `{ handler: () => {} }`, but it's configurable. I'll stick with the convention. Also, Lambdas can either report that they are complete via a callback or a promise. I'm a big fan of async/await, so I'm going to go with that.

In order to make my module more testable I thought I would start by creating a module that the handler calls, so the index.js is quite simple:

```js
const redisClickLogger = require('./lib/redis-click-logger');

module.exports = {
	handler: async () => {
		return await redisClickLogger();
	}
};
```

Fine so far. Now let's look at some pseudocode of what the handler has to do. Its job will be to (1) grab a batch of click data from Redis and write it to the database, and then (2) send alerts based on that click data and some configuration of when to send each alert.

As I said, I was trying to do TDD. TDD purists, please forgive me. I know that I should have already written a test or two before even getting this far, but I'm new to this and I need to figure out the mechanics of my testing tools (pretty much the entire premise for this article) before I can attempt to do it "right." I've gotta walk before I can run.

Anyway, at this point I thought through my requirements and wrote a bunch of stories in the form of placeholder test cases:

```js
describe('redis-click-logger', () => {

	it('loads batch size from ENV vars', () => {});
	it('loads target environment id from ENV vars', () => {});
	it('loads config via http api', () => {});
	it('skips the localdev customer', () => {});
	it('does not run for customers with email disabled', () => {});
	it('batches notification setting reads', () => {});
	it('batches click activity writes', () => {});
	it('only processes alerts once per message per batch', () => {});

});
```

Seems like a good enough place to start. In theory the first two tests were easy enough to write; you can just set a value into `process.env`, run the function that loads it, and then check the actual value against the expected value:

```js
	it('loads batch size from ENV vars', () => {
		const testVal = parseInt(Math.random() * 1000);
		process.env.BATCH_SIZE = testVal;
		// todo: where are we getting the getBatchSize() method?
		const actual = getBatchSize();
		expect(actual).toEqual(testVal);
	});
```

But this is where I've run into my first hurdle. How do I implement this in a way that is both (1) Testable, and (2) not cumbersome to the application? Sure, I can take every method that I would ever want to write and make it into its own module so that I can test it in isolation, but I can see that very quickly getting to insanity-inspiring numbers of files. There must be a better way!

So, let me give two examples to illustrate the two concepts that I feel are at odds with one another.

First, here's how I might write the code to cleanly get the batch size in a reusable manner, if I wasn't at all concerned with testing:

```js
// lib/redis-click-logger.js
module.exports = async () => {
	const batchSize = getBatchSize();
	// ...
};

function getBatchSize ( defaultBatchSize = 1000 ){
	return process.env.BATCH_SIZE || defaultBatchSize;
}
```

The problem with this approach is that it doesn't export the `getBatchSize` function, and as far as I know, there's no good way to test that function in isolation as-written.

I come from a CFML background, and this is how we might write the same module in CFML:

```js
// lib/redis-click-logger.cfc
component {

	public function processClickBatch(){
		var batchSize = getBatchSize();
	}

	private function getBatchSize( defaultBatchSize = 1000 ){
		return server.system.environment['BATCH_SIZE'] ?: arguments.defaultBatchSize;
	}

}
```

In the above example, the `processClickBatch()` method is what's initially called upon to do the work, and it has access to call the private methods of the module. The testing and mocking tools available to us in CFML make it trivial to make the `getBatchSize()` function public during the test, and then it pretty much goes how I outlined in the test implementation I wrote above. Set some arbitrary value, run the getter, assert that it returned what you expected.

But how do I accomplish this in JavaScript? As previously mentioned, the only idea I've been struck with so far was to externalize all methods as modules and require them &mdash; which sounds like a patently bad idea.

Of course JavaScript has classes, but I hate them. More than just hate, they are not the recommended pattern for React.js apps, of which we have several and expect that we'll be writing a TON of React code in the near future. That code will need testing too, so even if classes could solve my problems now, I expect I'll run into the same problems later when we're using functional components and hooks, right? All the more reason to avoid JS classes as a solution now.

I feel like there's some 3rd option that I'm not seeing. There's gotta be, right?

Now here's where reality is setting in: I pretty much burned my entire day yesterday trying to get over this hurdle. Testing is important, but I can't let something so trivial completely block me from getting any work done. So for now, I'm putting TDD to the back of the stove and when I understand how to solve these problems I will come back and refactor my code to be testable and write the tests. In the meantime, I've got to get some work done.

---

\* By the by: If you're looking for a fantastic community of JavaScript developers, the [KCD Discord][kcdd] is amazing. I can't recommend it strongly enough.

[kcdd]: https://kentcdodds.com/discord
[lip]: https://www.swyx.io/learn-in-public/
