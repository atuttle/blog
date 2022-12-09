---
title: 'How to subscribe to changes of individual properties within a Svelte store'
desc: "It's obvious once you see it. Not so obvious before that."
img: /img/2022/ferenc-almasi-eYpcLDXHVb0-unsplash.jpg
date: 2022-12-09
tags:
  - svelte
---

Svelte stores are great. You can easily subscribe to them to be notified when a value changes, and react accordingly.

```js
//store.ts
import { writable } from 'svelte/store';
import type { Filter } from './ListFilterTypes';

export const emptyFilter: Filter = {
	filterId: null,
	filterName: '',
	operator: null,
	not: false,
	value: '',
	min: '',
	max: ''
};

export const filter = writable < Filter > Object.assign({}, emptyFilter);
```

```js
//App.svelte
import { filter } from './store';

filter.subscribe(($filter) => {
	/* do awesome stuff */
});
```

But stores like the one above, which contain an entire object with various properties in it, always notify subscribers if _any_ property changes. What if you have a special case where you want a subscription that only executes when the `value` property is updated?

I scratched my head on this for a few minutes. At first I thought there might be an extra argument to the `subscribe` method that I could make use of. A quick scan of the docs showed that there wasn't. So what's one to do?

## Use a derived store

Derived stores allow you to create a new store that is based on the value of an existing store. Any time the first store is updated the derived store gets updated.

So we can easily add a derived store to our `store.ts` file:

```js/0,4
import { writable, derived } from 'svelte/store';

export const filter = writable < Filter > Object.assign({}, emptyFilter);

export const filterValue = derived(filter, ($filter) => $filter.value);
```

Now there's a store named `filterValue` that will be updated only when `filter.value` changes. In all other ways we can treat it like a normal store, which means that subscribing to `filter.value` changes is super easy:

```js
//App.svelte
import { filter, filterValue } from './store';

filterValue.subscribe(($filterValue) => {
	/* do awesome stuff that only needs to happen when filter.value changes */
});
```
