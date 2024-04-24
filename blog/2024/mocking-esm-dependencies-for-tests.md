---
title: "ESM Mocking, except it doesn't suck"
desc: "ESM is supposed to be the future of JavaScript, but writing tests for ESM code can still be a huge pain because of one problem: Mocking. I've found an easy way to make ESM mocking <em>just work</em>."
img: /img/2024/finan-akbar-HuC3cii5VA8-unsplash.jpg
date: 2024-04-24 16:30:00
tags:
  - javascript
  - esm
  - testing
  - mocking
---

![Japanese masks hang in a row](/img/2024/finan-akbar-HuC3cii5VA8-unsplash.jpg)

Photo by <a href="https://unsplash.com/@finan?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Finan Akbar</a> on <a href="https://unsplash.com/photos/assorted-mask-wall-decor-HuC3cii5VA8?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>{class="photo-byline"}

I've been trying to lead the charge for my team and my company to move our JavaScript code into what we're told is the glorious future of [ESM](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules), and overall I do like it. But testing, and particularly mocking, can feel impossible at times.

Jest does have reasonably good support for mocking that works with ESM (at least as good as it works for CJS, anyway), but I have some gripes with Jest[^1], and Node [has native testing utilities now](), so while we're modernizing, I'd love to move away from Jest, too.

I spent some time looking for information on "the right way" to do mocking with ESModules (without Jest), and was not happy with what I found. There's [esmock](https://github.com/iambumblehead/esmock) and [mockingbird](https://github.com/omermorad/mockingbird); but I found the latter to be too complex, and while the former seemed like it might be simpler, I couldn't get it working the way I wanted (see also: "at all") and the docs were not super clear. Eventually I found ["Mocking ESM Without Loaders"](https://nalanj.dev/posts/mocking-without-loaders/), and this made instant sense.

It seemed too good to be true, but it would take some work to try it out for myself. I couldn't find a package that did this already, so I created [@atcodes/mockable](https://www.npmjs.com/package/@atcodes/mockable), which is a slightly cleaned up copy of the code from that article. Once I had that, I was able to write some tests with mocks to give it a try:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import sinon from 'sinon';

//getDb is the function I want to mock
import { getDb } from '@alumniq/tsdb';

//this is the part of the application I want to test
//it uses getDb, after importing it exactly as I've done above
import Worker from './Worker.js';

test('exits without deleting anything if batch is empty', async (ctx) => {
	//create some mocks using sinon.js
	const query = sinon.fake(async () => []);
	const end = sinon.fake(async () => true);
	const mockGetDb = sinon.fake(async () => ({ query, end }));

	//use the mockable package to override the getDb import
	getDb.override(mockGetDb);

	//setup the cleanup that will run after this test completes
	ctx.after(() => {
		sinon.restore();
		getDb.clear();
	});

	//run the app code
	const result = await Worker('ABCDEF', 12345);

	//assertions! 🎉
	assert.strictEqual(result, 'done, shutting down.');
	assert.strictEqual(mockGetDb.callCount, 1);
	assert.strictEqual(query.callCount, 1);
	assert.strictEqual(end.callCount, 1);
});
```

I think there are two interesting points to make about the above code sample.

1. I'm using [sinon.js](https://sinonjs.org/) to create what they call "fakes", which are just functions that respond as you implement, but also track their calls, arguments, etc, for assertion purposes. This is what allows me to assert that `query` and `end` were called exactly once each, etc. Unfortunately, if Sinon has a good ESM mocking story, I couldn't find it. But it does work well for this purpose.
1. You might be wondering where `getDb.override()` is defined. That comes from [@atcodes/mockable](https://www.npmjs.com/package/@atcodes/mockable), and it's applied in the `@alumniq/tsdb` module itself, for the convenience of all of our applications. In this case, `@alumniq/tsdb` is code my team has control over, so there's no reason not to add the `mockable()` wrapper in the library itself. It can be done for a 3rd party library, though. All you have to do is create a proxy module in your app that imports the 3rd party library and wraps it with `mockable()`. For example, if we didn't have control over `@alumniq/tsdb`, I could add this to the application:

```ts
// getDb.ts
import { getDb as _getDb } from '@alumniq/tsdb';
import { mockable } from '@atcodes/mockable';

export const getDb = mockable(_getDb);
```

Then, application code that wants to use `getDb` would import it from this module instead of directly from `@alumniq/tsdb`.

Anything that makes testing easier is worth every penny it costs, because in my experience nobody does enough testing. Fortunately, the "cost" of this approach is near zero.

[^1]: Jest has lots of dependencies, it requires babel- or esbuild-based plugins to support ESM at all, and the mocking documentation is lackluster at best.
