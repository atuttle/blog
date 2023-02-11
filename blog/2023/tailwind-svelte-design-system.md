---
title: Fix missing CSS when Using Tailwind to write a Svelte component library
desc: Tailwind's JIT compiler is awesome, but by default it won't inspect installed component libraries.
img: /img/2023/deva-darshan-Jt9syHEhrPE-unsplash.jpg
date: 2023-02-13
tags:
  - svelte
  - tailwind
---

![Cloverleaf shaped highway interchange](/img/2023/deva-darshan-Jt9syHEhrPE-unsplash.jpg)
Photo by <a href="https://unsplash.com/@darshan394?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Deva Darshan</a> on <a href="https://unsplash.com/photos/Jt9syHEhrPE?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>{class="photo-byline"}

In my free time (because I am a giant nerd) I have been working on a Svelte-based design system for my company to use. I'm using Tailwind to style my components, because Tailwind is awesome. (_Fight me._)

To make it maximally reusable, it is its own project which we'll install using npm.

Unfortunately, while I got pretty far building components, when I went to implement them in an application, I found that the Tailwind styling I applied in the design system project wasn't being (completely) adhered to in the parent application.

The class names were still present in the generated HTML, but the Tailwind JIT compiler wasn't detecting that they were being used, and including those in the generated CSS. Any classes that were also used in the parent app would be in the generated CSS, and they would work on my components, but anything unique to the components would be missing. I am [not alone in running into this problem](https://github.com/svelte-add/svelte-add/issues/180).

I had started down the path of writing a custom solution to use a Svelte action that would inspect the `class` attribute of the element and convert the class names into the equivalent CSS rules and add them to the `style` attribute...

```html
<div class="bg-slate-300 hover:bg-slate-100" use:tailwindToCSS></div>
```

While this was a fun distraction to think about for a little while, it's misguided. It can't handle hover states, responsive design, and other dynamic features like dark mode -- at least not without adding a bunch of JS, which was something I didn't really want to do.

Fortunately, there are a lot of really smart people on the Tailwind Discord server, and one of them put me on the right path. (Thanks, [Bill Criswell](https://github.com/crswll)!)

Using Tailwind in Svelte requires the use of a `tailwind.config.cjs` file, which looks like this by default:

```js
const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {}
	},
	plugins: []
};

module.exports = config;
```

If our design system is available inside of `node_modules/...` then all we need to do is tell Tailwind to parse those files, too...

```js/3
const config = {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/@COMPANY/DESIGN_SYSTEM/**/*.{html,js,svelte,ts}'
	],
	theme: {
		extend: {}
	},
	plugins: []
};

module.exports = config;
```

While this probably isn't an ideal situation if you want to create a public design system (ala Bootstrap), because requiring people to setup Tailwind and modify its config seems like it might be asking a bit much, it's certainly a fine solution for something like a company-internal design system, and it's the approach I intend to use.
