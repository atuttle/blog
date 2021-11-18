---
title: 'SvelteKit: Customizing app.html at Runtime'
desc: It's not a common use case, but if you ever need it then this is a really handy trick.
img: /img/2021/split.jpg
date: 2021-11-16
tags:
  - svelte
  - sveltekit
  - javascript
---

SvelteKit works by starting with a static `app.html` file that (as of the time of this writing) contains a `<div id="svelte"></div>`, into which your Svelte app is hydrated during server-side rendering (SSR); and the Svelte compiler is also aware of this div (thanks to `svelte.config.js`) so that it can plan its DOM updates accordingly.

For almost all use-cases, this is fine. But what do you do if it's not going to work for **your** use-case? If there's interest I can cover my specific use case in the future, but for now let's focus less on the _why_ and more on the _how_.

Let's start with the list of requirements that makes this functionality necessary:

- The "skin" of the page (the html that comes before and after your Svelte app in the document, including the head tag) must be 100% dynamic, determined and loaded at runtime.
- Variations of allowable skins that have been pre-loaded at compile time are not sufficient; you need the ability to modify them and see the updates in real-time, without re-compiling the application.

If those are your requirements, then this is the solution for you.

First, create a `hooks.js` file, and export a `handle` method. We're going to create a [handle hook][].

```js
// src/hooks.js
export async function handle({ request, resolve }) {
	const response = await resolve(request);
	return response;
}
```

As written here, this hook does not deviate from the SvelteKit default behavior. We'll get to that shortly. But first we need to tell SvelteKit about our hook. We do that by editing `svelte.config.js`:

```js/4-6
// svelte.config.js
const config = {
	kit: {
		target: '#svelte',
		files: {
			hooks: './src/hooks.js'
		}
	}
};
export default config;
```

This tells SvelteKit to look for our custom hooks implementations in the file we created previously.

Now we can get to the fun part.

Back in our custom handle hook, we want to determine what the REAL skin html should be, and inject it.

1. Determine the values that we feed into the algorithm that provides the skin html as its result
2. Get the skin html
3. Parse the skin html into useful chunks
4. Inject those chunks into app.html

### Part 1: Determine Input Args for Skin Lookup

Let's assume the skin can be determined from the domain name and URL string; because that's what my need is.

```js/4
// src/hooks.js
import getSkin from '$lib/getSkin';

export async function handle({ request, resolve }) {
	const skinHTML = await getSkin( request.host, request.path );
	const response = await resolve(request);
	return response;
}
```

### Part 2: Get the Skin HTML

For the sake of clean code and a short-ish article, I'll leave the actual skin html lookup code as an exercise for the reader. In my case, I'm making an HTTP request to an API and the skin html is returned in a property in the JSON response.

```js
// src/lib/getSkin.js
export default async function getSkin(host, path){
	const apiRespose = await fetch(...);
}
```

### Part 3: Parse the Skin HTML

In order to be easily injected into app.html, we need to do a tiny amount of processing on the HTML we got from the previous step. Ultimately, we want `getSkin()` to return an object with 3 properties: `before`, `after`, and `head`. The `head` property will contain everything between the `<head></head>` tags in the skin HTML. The `before` and `after` properties will contain everything in the `<body></body>` tag, but split into two chunks based on a predetermined token. In my case, the skin is required to have the token `{{ "{{app}}" }}`, and so I want `before` to be everything before `{{ "{{app}}" }}` and `after` to be everything after it -- from within the `<body></body>` tags.

So if my skin HTML looked like this:

```html
<html>
	<head>
		<title>This is my skin</title>
		<link rel="stylesheet" href="/assets/bootstrap.min.css" />
	</head>
	<body>
		<div class="container">
			<p>There are many like it.</p>
			{{ "{{app}}" }}
			<p>But this one is mine.</p>
		</div>
	</body>
</html>
```

Then my resulting data response should look like this:

```js
{
	head: '<title>This is my skin</title><link rel="stylesheet" href="/assets/bootstrap.min.css" />',
	before: '<div class="container"><p>There are many like it.</p>',
	after: '<p>But this one is mine.</p></div>'
}
```

Note that on their own, the HTML fragments in `before` and `after` are malformed HTML (at least for the example skin I've provided). If we tried to accomplish what I'm about to do with the handle hook using `{@html before}` in a layout, it would only work if the HTML fragments are _not_ malformed.[^1] Part of what makes this approach better is that it doesn't suffer from that limitation.

How do you parse these sections out of a single HTML string? Like this:

```js/30
// src/lib/getSkin.js
function parseSkin(layout, appToken = '{{ "{{app}}" }}') {
	let [before, after] = layout.split(appToken);

	//linebreaks get in the way of our regexes, so remove them.
	before = before.replaceAll('\r', '').replaceAll('\n', '');
	after = after.replaceAll('\r', '').replaceAll('\n', '');

	//pull <head> stuff out of the skin and drop it in here:
	let head = before.match(/<head>(.*)<\/head>/gi);
	if (head) {
		head = head[0].replace('<head>', '').replace('</head>', '');
	} else {
		head = '';
	}

	//convert <body whatever="doesn't matter"> to <body>
	before = before.replaceAll(/<body([^>]+)>/gi, '<body>');

	//delete everything up to and including <body>
	before = before.replace(/^.+<body>/i, '');

	//delete everything including and after </body>
	after = after.replace(/<\/body>.*$/, '');

	return { before, after, head };
}

export default async function getSkin(host, path){
	const apiRespose = await fetch(...);
	return parseSkin( apiResponse.skinHTML );
}
```

### Part 4: Inject Skin Parts Into app.html

Now that we have head/before/after, we need to modify the response to inject our HTML fragments in the correct locations. There's a few different ways you could do this, but here's what I did.

I started by modifying app.html to add some tokens indicating locations for my additions:

```html/6,10,12
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<link rel="icon" href="/favicon.png" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		%tpl.head%
		%svelte.head%
	</head>
	<body>
		%tpl.before%
		<div id="svelte">%svelte.body%</div>
		%tpl.after%
	</body>
</html>
```

The `%svelte.head%` token was already there and is used by SvelteKit to inject the content you specify with `<svelte:head>`; so I built on that format to add my tokens. You could instead do the same with HTML comments, if you like that approach better: `<!-- TPL.HEAD -->`. It's just a string that will appear in the response buffer after SvelteKit does its SSR that you're going to replace &ndash; so do make it pretty unique and unlikely to appear in the app body.

Now doing the string replace becomes trivial:

```js
// src/hooks.js
import getSkin from '$lib/getSkin';

export async function handle({ request, resolve }) {
	const response = await resolve(request);
	const { head, before, after } = getSkin(request.host, request.path);
	response.body = response.body.replace('%tpl.head%', head);
	response.body = response.body.replace('%tpl.before%', before);
	response.body = response.body.replace('%tpl.after%', after);
	return response;
}
```

And lastly, for performance reasons and to not interfere with requests for assets other than HTML pages, we can add a simple conditional:

```js/5
// src/hooks.js
import getSkin from '$lib/getSkin';

export async function handle({ request, resolve }) {
	const response = await resolve(request);
	if (response.headers['content-type'] === 'text/html') {
		const { head, before, after } = getSkin(request.host, request.path);
		response.body = response.body.replace('%tpl.head%', head);
		response.body = response.body.replace('%tpl.before%', before);
		response.body = response.body.replace('%tpl.after%', after);
	}
	return response;
}
```

From a technical standpoint, that's pretty much it. Of course you'll want to cache your skin HTML lookup for whatever amount of time makes sense for you for performance reasons, but short of that and the api result fetch, this is everything you need.

While most of the code here is of my own design, I should note that the approach used in the handle hook itself was [suggested to me by Rich Harris][suggested], the creator of Svelte, when I had proposed a different way of accomplishing the same goal -- because this way is much more germane to the project. Indeed, it requires no modification to SvelteKit at all.

I also got lots of additional help along the way from various helpful people in the [Svelte Discord][discord], and I'm happy to report that the people there have always been very kind and generous in helping me figure out what I'm doing wrong. But it's fair to say that the _best_ help I got came only after I put in the effort to [make a pull request with my own idea][pr]; pretty clearly illustrating the power of [Cunningham's Law][cunningham].

[^1]: I know, because I tried that first.

[handle hook]: https://kit.svelte.dev/docs#hooks-handle
[suggested]: https://github.com/sveltejs/kit/pull/2773#issuecomment-967099525
[discord]: https://svelte.dev/chat
[pr]: https://github.com/sveltejs/kit/pull/2773
[cunningham]: https://meta.wikimedia.org/wiki/Cunningham%27s_Law
