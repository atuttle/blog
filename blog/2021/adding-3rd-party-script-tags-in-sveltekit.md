---
title: 'How do I add a 3rd party script tag to a SvelteKit page body?'
desc: This was one of the first few problems I faced when learning SvelteKit, and the solution is surprisingly easy!
img: /img/2021/danny-howe-bn-D2bCvpik-unsplash.jpg
credit: Photo by <a href="https://unsplash.com/@dannyhowe?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Danny Howe</a> on <a href="https://unsplash.com/s/photos/party?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
date: 2021-11-30
tags:
  - sveltekit
  - svelte
---

![A giant crowd at a concert, at night](/img/2021/danny-howe-bn-D2bCvpik-unsplash.jpg)

Photo by <a href="https://unsplash.com/@dannyhowe?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Danny Howe</a> on <a href="https://unsplash.com/s/photos/party?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>{class="photo-byline"}

Early in the process of playing with the idea of using SvelteKit for [my website redesign][redesign] I ran into a couple of issues that I couldn't figure out. I spent a few hours brainstorming, and asking for help in the (_excellent!_) [Svelte Discord][sveltediscord], but wasn't able to come up with a solution.

The biggest problem I had was embedding a 3rd party `<script>` tag in the page content.

You might be asking yourself why anyone would do that in 2021. The answer is integrations. The `<script>` tag is for the email signup form [on the root page of my site](/).

## Embedding 3rd Party Javascript Tags in SvelteKit Page Content

If you try to add a `<script>` tag to a SvelteKit page to embed an external script, you're probably going to run into an error:

```html
<h1>Welcome to the Church of Mountain Dew</h1>

<script src="https://adam-tuttle.ck.page/02c5dc9bec/index.js"></script>
```

![SvelteKit error message reading, "A component can only have one instance-level <script> element"](/img/2021/sveltekit_script_embed_error.png)

**SvelteKit Error:** A component can only have one instance-level `<script>` element{class="photo-byline"}

So what's the magic fix? It's almost too easy.

Wrap it in an [`{#if browser}{/if}`](https://kit.svelte.dev/docs#modules-$app-env) conditional:

```html
<script>
	import { browser } from '$app/env';
</script>

<h1>Welcome to the Church of Mountain Dew</h1>

{#if browser}
<script src="https://adam-tuttle.ck.page/02c5dc9bec/index.js"></script>
{/if}
```

No more error, and the script tag is embedded and executes exactly as expected.

Like so many other things in Svelte, when I saw that this was the solution I sat there slack-jawed and asked myself, "Is that really all that's needed?"

[redesign]: /blog/2021/a-bunch-of-changes/
[sveltediscord]: https://discord.gg/svelte