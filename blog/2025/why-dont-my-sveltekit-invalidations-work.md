---
title: "Why don't my SvelteKit invalidations work?"
desc: "It took me an embarassingly long time to figure out what I was doing wrong, so I'm sharing the fix."
img: /img/2025/the-chaffins-lDKfrHqps0w-unsplash.jpg
date: 2025-04-04 7:30:00
tags:
  - javascript
  - esm
  - testing
  - mocking
---

![A dark and moody view down a spiraling staircase](/img/2025/the-chaffins-lDKfrHqps0w-unsplash.jpg)

Photo by <a href="https://unsplash.com/@thechaffins?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">The Chaffins</a> on <a href="https://unsplash.com/photos/people-walk-down-a-spiraling-staircase-lDKfrHqps0w?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>{class="photo-byline"}

You think you're using SvelteKit as prescribed, and following the instructions in the [invalidations docs][docs], but your invalidations don't seem to be working. In fact, you can open the browser developer tools and see the network request being made to get the updated data, but the page doesn't update. What gives?!

Bottom line up front: You're probably not referencing a reactive variable.

## A quick refresher on reactive variables

```html
<script lang="ts">
	let count = $state(0);
</script>

<button onclick={() => count++}>{count}</button>
```

When you click the button, the count goes up, and you can see it update on the button label. This works because of the magic of the `$state()` rune. Svelte is made aware that the value is expected to change over time and when it does, things that reference it should be re-rendered.

But if you change `let count = $state(0);` to simply `let count = 0;` then your button label does not update.

## How reactive variables apply in this case

If you're like me, your page probably looks something like this:

```html
<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
	let { foo, bar, baz } = data;
</script>

{#each foo as item}
<div>{item}</div>
{/each}
```

In this case, the `data` variable pulled from `$props()` is reactive. But when you destructure it, it is no longer reactive. You have a couple of options.

1. Reference everything from `data` directly, like this:

```html
<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
</script>

{#each data.foo as item}
<div>{item}</div>
{/each}
```

2. Use the `$derived()` rune to create a reactive variable that references the destructured values:

```html
<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
	let foo = $derived(data.foo);
</script>

{#each foo as item}
<div>{item}</div>
{/each}
```

Either way, as long as you're referencing reactive variables, they should update as expected when `invalidate()` runs.

[docs]: https://svelte.dev/docs/kit/$app-navigation#invalidate
