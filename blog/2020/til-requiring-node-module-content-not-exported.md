---
title: "TIL: Requiring a file that isn't exported by a node module"
desc:
img: /img/2020/krakenimages-8RXmc8pLX_I-unsplash.jpg
date: 2020-01-07
tags:
  - node
commentsPostId: require-not-exported
---

![Surprised older man peeks out from behind a wall](/img/2020/krakenimages-8RXmc8pLX_I-unsplash.jpg)

Photo by <a href="https://unsplash.com/@krakenimages?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">krakenimages</a> on <a href="https://unsplash.com/s/photos/secret?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>{class="photo-byline"}

Long ago I learned the trick of requiring individual functions from Lodash to keep my bundle size down:

```js
const debounce = require('lodash/debounce');
```

I always wondered how it was done (some fancy trick of prototypal inheritance?) but never got around to figuring it out.

Last week I decided that I needed to figure it out, because it would be _really_ handy in my current project with one of our internal company modules.

I should have just trusted my gut and tried it because &mdash;spoiler alert&mdash; I was right, but first I felt the need to troll around Stack Overflow and Duck Duck Go looking for people who had discussed this technique. I spent easily an hour looking for some sort of guide, digging through the Lodash source on github (not fruitful because their repo is, in their own words, messy right now as they work on a new major version), and when I couldn't find anything helpful I decided to just try some things and see if I could figure it out on my own.

It's really rather easy: You can require any file in a module, even if it's not exported.

`package.json` has an attribute named `main` which tells node which file (e.g. `index.js`) to load when you run `require('foo')`. That file is executed and if it **exports** anything, that export is available to the requiring code as the return value.

But suppose you want a utility baked into the module but that's not exported for... _reasons_. If that utility is found in the root of your module as `util.js` then you can use `require('foo/util')` (or `require('foo/util.js')` if you prefer). That file `util.js` may export something, e.g. the utility function we're after. The file you want doesn't have to be in the root of the module. If `util.js` was in a folder named `bar` then you could `require('foo/bar/util')`. It's really just that simple.

Going back to the Lodash example, the reason you can `require('lodash/debounce')` or `require('lodash/partition')` is because each of those functions is available as a file in the root of the module.

Hopefully this helps get some information on this practice into search engines, and hopefully I can find it the next time I'm wondering how it's done.
