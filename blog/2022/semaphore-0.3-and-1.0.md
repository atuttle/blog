---
title: Semaphore 0.3 and 1.0
desc: Semaphore is about to get its first major version bump, which means there's a breaking change. I wonder what it could be!
img: /img/2021/640px-US_Navy_051129-N-0685C-007_Quartermaster_Seaman_Ryan_Ruona_signals_with_semaphore_flags_during_a_replenishment_at_sea.jpg
date: 2022-05-11
tags:
  - semaphore
  - open source
---

Today I am releasing Semaphore version 0.3, which includes no functional changes, but serves as a ⚠️ **deprecation warning** ⚠️ for breaking changes coming in v1.0, soon[^1].

My team has been using Semaphore in production for almost a year now, and it's been working great _with one annoying exception_. The way the rules engine is implemented means that in order to accomplish a true combination of "AND" and "OR" rules for a single feature, we ended up hoisting the AND/OR implementation out a layer. There's currently no way to do it inside of semaphore.

Consider these rules: Feature X should be enabled if:

1. env == `development`; OR
1. (env == `QA` AND customer == `Disney`); OR
1. (env == `production` AND customer in `Disney, Pop Tarts`)

Semaphore v0.2 allows you to create a flat list of rules, and a single combination expression (AND vs. OR). Because of this, you can't have different subsets of rules for different environments, for example. You can have a flag that will be on when `env=development`; and you can have a flag that will be on when `env=production AND customer in list "Disney, Pop Tarts"`... But you can't use both AND and OR in a single flag.

So, what we did on our team was wrap semaphore in a `featureFlagService` which allowed us to check multiple flags at once, and return true if any of those flags evaluated to true. This allowed us to create separate flags, i.e. `some-feature-dev`, `some-feature-qa`, and `some-feature-prod`, each of them implementing only 1 of the numbered sets of rules above, and then we would check all of those flags in our code:

```js
if (flagEnabled('some-feature-dev,some-feature-qa,some-feature-prod')) {
	newImplementation();
} else {
	oldImplementation();
}
```

This works fine, but it's annoying, because it requires managing 3 feature flags for every feature; possibly more if you aren't primarily splitting on 3 possible environments!

Fixing this requires making a breaking change to the DSL for specifying flag rules. If you have some sort of GUI for creating and managing flags, it will need to be updated to read and output these changes to the underlying data.

Currently, a flag consists of:

```js/5-9
'flag-id': {
	name: string,
	description: string,
	active: boolean,
	baseState: boolean,
	matchRules: ANY | ALL,
	rules: [
		RULE,
		RULE...
	]
}
```

and RULEs consist of:

```js
{
	type: filter | % | nobody | everybody,
	attribute: string,
	operator: == | != | < | <= | > | >= | in | has,
	comparator: boolean | numeric | string | string[]
}
```

In order to support combinations of AND/OR, the flag structure is changing to the following:

```js/5-8
'flag-id': {
	name: string,
	description: string,
	active: boolean,
	baseState: boolean,
	rules: [
		[ RULE, RULE, RULE, ... ],
		[ RULE, RULE, ... ],
	]
}
```

Note that the `matchRules` property is gone. It will now always behave as an OR against the top-level arrays, and an AND for the rules inside each inner array.

Hopefully that makes sense. Basically:

```js
rules: [
	[RULE, /* and */ RULE, /* and */ RULE],
	/* or */
	[RULE, /* and */ RULE, /* and */ RULE]
	/* or... */
];
```

This exact same structure will be required in ALL cases. That includes scenarios where you have just two rules and you want them to be evaluated using an OR:

```js
rules: [
	[this],
	/* or */
	[that]
];
```

... Or even just a single rule:

```js
rules: [[other]];
```

I expect that this change should greatly improve my teams happiness using Semaphore[^2], and hopefully yours too.

[^1]: Tentatively targeting May 19th; exactly 1 year after Semaphore's [introduction](/blog/2021/introducing-semaphore/).
[^2]: To be fair, we're already quite happy with it!
