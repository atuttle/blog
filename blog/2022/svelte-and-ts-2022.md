---
title: How to use TypeScript with Svelte and Vite in 2022
date: 2022-11-07
desc: A quick reference on the current state of how to configure your Svelte project for TypeScript usage.
img: /img/2021/barrett-ward-5WQJ_ejZ7y8-unsplash.jpg
tags:
  - svelte
  - typescript
---

As of the time of this writing, Svelte uses Vite for builds, and while Vite will automatically handle `.ts` files, it won't handle TypeScript in `.svelte` files.

For this to work, you need to preprocess your `.svelte` files using [svelte-preprocess][spp]. Unfortunately their guides seem to be a bit outdated (references to Rollup abound). So I figured it out for myself (not that it was that hard) and I'm sharing it here for you and for future me.

```bash
$ npm i -D svelte-preprocess
```

Once you have `svelte-preprocess` installed, create a `svelte.config.js` in the root of your svelte project (e.g. same folder as your `package.json`) and paste this content into it:

```js
import preprocess from 'svelte-preprocess';

const config = {
	preprocess: preprocess()
};

export default config;
```

That's it. Vite builds will now preprocess your `.svelte` files, and `svelte-preprocess` has baked-in support for TypeScript, so builds should now stop throwing these errors because the Svelte compiler doesn't recognize your TypeScript:

> Error [ParseError]: Unexpected token

[spp]: https://github.com/sveltejs/svelte-preprocess
