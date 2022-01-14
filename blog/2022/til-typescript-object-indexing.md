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

It would be easy to feel a responsibility to create a named type for everything in a TypeScript application. And for domain primitives, it makes sense to do so. "Domain primitives" would be roughly analagous to "database tables." But it would be a mistake to create a named type for every intermediary type necessary to write an application. This is (probably?) a good chunk of the reason that anonymous types are supported: You only need them in one location, or in a way where defining them once allows all uses to be inferred.

However, I ran into a problem with an anonymous type that represented some data that I had massged into a different shape in order to be useful for my application. It took some googling and reading, but eventually I found the [index signatures][isig] documentation, which solved my problem.

But before I give you the answer, here's a real world example of why I needed to use it. _Don't worry, it doesn't use any generics!_

I'm working on an application that builds and runs dynamic SQL based on chunks of SQL it pulls out of the database. I know that sounds a little bit crazy, but you're just going to have to trust me that it makes sense for what we're doing. Anyway, those chunks of SQL have their own table (`FilterDefinition`s) and get referenced in another table (`Filter`s) that use this type[^1]:

```ts
interface Filter {
	filterDefinitionId: number;
	filterId: string;
	filterName?: string;
	joinGroup?: string;
	not: boolean | string;
	value: string | number;
	max: string | number;
	min: string | number;
	operator: FilterOperator;
}
```

In the application, users build lists composed of a collection of filters combined using AND and OR. The data looks something like this:

```js
{
	id: 'guid-here',
	type: 'grouping',
	operator: 'AND',
	filters: [
		// Objects of type Filter
	]
}
```

There are also types for a `FilterCollection` (what the above data represents[^2]) and the `FilterDefinition`s referenced by `Filter`s, but they're not necessary to make my point.

So a given `List` has a `FilterCollection` containing one or more `filters` that might need to be combined. Of course, based on the `FilterDefinition` of the Filter there are different ways we might need to combine those filters. For example, we might need to group some of them.

Maybe it will help if I pull back the curtain a little bit more. Let's say that one filter is for "Degree Year", and another is for "Degree Major." If you asked for people with degree year 2021 and degree major of Software Engineering, there's a good chance that what you really want is people who got a Software Engineering degree AND that degree was awarded in the year 2021. So we have to take those two primitives and massage them together so they become one query.

In our app, we accomplish that with the `joinGroup` property. If they have the same `joinGroup` value, and unless you separate them with an `OR` operator in your `FilterCollection`, we will combine them. We combine them by massaging the `FilterCollection` into a different object that represents all of the same requested filters, but organized into groups based on joinGroup:

```js
{
	'degree': [
		{ /* degree_year filter */ },
		{ /* degree_major filter */ }
	],
	'__isolated__': [
		/* filters with no join group go here, which we know to run in isolation */
	]
}
```

The function that creates this data structure is pretty simple:

```ts/0-1
function joinGroupFilters(filters: Filter[]): any {
	let groups: any = {};
	filters.forEach((f) => {
		const joinGroup = f.joinGroup ?? '';
		if (!(joinGroup in groups)) {
			groups[joinGroup] = [];
		}
		groups[joinGroup].push(f);
	});
	return groups;
}
```

I've used `any` here as a placeholder for this imaginary anonymous type that we need to create that defines what we're trying to produce. So my question was, "How do I create a type that indicates that it's an object with arbitrary strings as keys, and arrays of Filters as values?"

If we take off those `any` types, we get this error from TypeScript:

> Element implicitly has an 'any' type because expression of type 'string' can't be used to index type '{}'.

We can use the `any` type and call it a day, but that has deletirious effects downstream in the app, as TypeScript won't really know what to expect, and so it's not really offering us much (any? (heh)) benefit when working with this data after it's been massaged. So it would be nice if we knew how to properly type this.

So here's the answer, given a name only to help it syntax highlight and make sense:

```ts
interface GroupedFilters {
	[index: string]: Filter[];
}
```

And here's how you might apply it in an anonymous fashion:

```ts/0-1
function joinGroupFilters(filters: Filter[]): { [index: string]: Filter[] } {
	let groups: any = {};
	filters.forEach((f) => {
		const joinGroup = f.joinGroup ?? '__isolated__';
		if (!(joinGroup in groups)) {
			groups[joinGroup] = [];
		}
		groups[joinGroup].push(f);
	});
	return groups;
}
```

Note that the first line of the method still declares the `groups` object as `any` but TS doesn't complain about this because it can see from the input type, the output type, and the logic of the function that the contract is being adhered to.

So the trick was the use of the `[index: string]` syntax. You're telling TS that the object will be indexed by strings. Let's review what the original error message was:

> ... because expression of type 'string' can't be used to index type '{}'.

Hopefully, for myself and for you alike, seeing this error message in the future will jog our memories about this `[index:]` syntax.

[^1]: I'm still not clear on the difference between a Type and an Interface...
[^2]: Sorta. I'm cutting some corners for the sake of brevity.

[handbook]: https://www.typescriptlang.org/docs/handbook/intro.html
[isig]: https://www.typescriptlang.org/docs/handbook/2/objects.html#index-signatures
