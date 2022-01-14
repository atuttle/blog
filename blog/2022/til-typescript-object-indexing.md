---
title: 'TIL: TypeScript Index Signatures are super useful!'
desc: 'The first major stumble I had while learning TS was how to create useful anonymous types for massaged data. The answer turns out to be really simple and once you know the technique the error message is a useful reminder.'
img: /img/2022/markus-spiske-vPGJ2fMsWkQ-unsplash.jpg
date: 2022-01-14
tags:
  - javascript
  - typescript
---

![A ripe banana on a yellow background](/img/2022/markus-spiske-vPGJ2fMsWkQ-unsplash.jpg)

Photo by <a href="https://unsplash.com/@markusspiske?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Markus Spiske</a> on <a href="https://unsplash.com/s/photos/definition?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>{class="photo-byline"}

> _**Heads up:** I'm new to TypeScript. This is my first entry on the subject and it's entirely possible I'm giving bad advice here. I'm sharing as I learn, and I haven't (yet?) taken the time to read through the [TypeScript handbook][handbook]. Please feel free to help me learn more, and definitely don't take what I say here as any sort of best practice; even if I do get lucky enough to stumble into the truth._

I ran into a problem trying to type some data that represented a collection of other Types that I had massaged into a different shape in order to be useful for my application. It took some googling and reading, but eventually I found the [index signatures][isig] documentation, which solved my problem.

Let's assume you have an array of Widget objects:

```ts
interface Widget {
	category: 'thingamajigs' | 'whosawhatsis';
	squanches: boolean;
	universeId: string;
}
```

And let's further assume that you need to break that array of `Widget`s up into a set of named arrays, one per category, and the category name is the key of the object. After doing so, it would look like this:

```js
{
	'thingamajigs': [
		//Wiget
		//Wiget
		//Wiget
	],
	'whosawhatsis': [
		//Wiget
		//Wiget
	]
}
```

The function that creates this data structure is pretty simple[^1]:

```ts
function categorizeWidgets(widgets: Widget[]): any {
	let groups: any = {};
	widgets.forEach((w) => {
		const cat = w.category;
		groups[cat] ??= [];
		groups[cat].push(w);
	});
	return groups;
}
```

I've used `any` here as a placeholder for this imaginary anonymous type that we need to create that defines what we're trying to produce. So my question was, "How do I create a type that indicates that it's an object with arbitrary strings as keys, and arrays of `Widget`s as values?"

If we take off those `any` types, we get this error from TypeScript:

> Element implicitly has an 'any' type because expression of type 'string' can't be used to index type '{}'.

We can use the `any` type and call it a day (hey, the error went away!), but that has deleterious effects downstream in the app, since TypeScript won't really know what to expect, and so it's not really offering us much (any? (heh)) benefit when working with this data after it's been massaged. So it would be nice if we knew how to properly type this.

We already have the `Widget` type, so you might think that you should create a `CategorizedWidgetCollection` type &mdash;and maybe you should, depending on how often you'll use it&mdash; but regardless, how do you specify the type of this object?

I started with the basic `{}` (or `Object`), but of course TypeScript wasn't too happy with me. The same error comes back.

So here's the answer, given a name only to help it syntax highlight and make sense:

```ts
interface CategorizedWidgetCollection {
	[index: string]: Widget[];
}
```

And here's how you might apply it in an anonymous-type fashion:

```ts
function categorizeWidgets(widgets: Widget[]): { [index: string]: Widget[] } {
	let groups: any = {};
	widgets.forEach((w) => {
		const cat = w.category;
		groups[cat] ??= [];
		groups[cat].push(w);
	});
	return groups;
}
```

Note that the first line of the method still declares the `groups` object as `any` but TS doesn't complain about this because it can see from the input type, the output type, and the logic of the function that the contract is being adhered to.

So the trick was the use of the `[index: string]` syntax. You're telling TS that the object will be indexed by strings. If we look back at the error message one last time...

> ... because expression of type 'string' can't be used to index type '{}'.

Hopefully, for myself and for you alike, seeing this error message in the future will jog our memories about this `[index:]` syntax.

[^1]: If you're not familiar with the syntax `x ??= y`, it's shorthand for `if (typeof x === 'undefined' || x === null){ x = y }`. I only just [learned](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_nullish_assignment) of it today. This is something I've been wanting for at least 10 years! I love how much JS is evolving these days!

[handbook]: https://www.typescriptlang.org/docs/handbook/intro.html
[isig]: https://www.typescriptlang.org/docs/handbook/2/objects.html#index-signatures
