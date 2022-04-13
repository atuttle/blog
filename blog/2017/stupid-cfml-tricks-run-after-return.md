---
title: 'Stupid CFML Tricks: Run after return'
desc: 'Adam discovers an inadvisable approach to running one-off background tasks in CFML'
img: /img/2017/matias-mateo-wlhDrLieboE-unsplash.jpg
date: 2017-05-12 15:30:00
tags:
  - cfml
---

> This article was originally focused on CFML and erroneously claimed that you could execute code after a `return` statement by putting it in the `finally` block of a `try/finally` statement. What follows is what I've since learned about how try/catch/finally works. Thanks to [Sean Corfield](https://corfield.org/) for educating me on how I originally understood this incorrectly.

When I first learned about try/catch/finally, everything made perfect sense to me. The `try` block executes; if there's an error it's handled by the `catch` block, and then if there's a `finally` block then it is executed after the `try` block (if successful) or after the `catch` block (if an error was thrown in the `try` block).

Now let's make things interesting! What happens when your try block contains a `return` statement?

```js
const example = () => {
	let x = 1;
	try {
		return x;
	} finally {
		x = 2;
		console.log('inside finally! x=', x);
	}
};

console.log(example());
```

Without testing it, what do you think happens? Does the function return 1 or 2?

As it turns out, the function returns 1; but first it logs that x=2.

This makes sense because the sequence of events is:

- `x = 1`
- the line `return x` is evaluated; but...
- since there's a `finally` block, that's executed, so...
- x is then updated to the value 2,
- it prints `inside finally! x=2`
- and now that the finally block has executed, the `return x` (which was evaluated to `return 1`) executes.

Using `finally` is shorthand for copy+pasting the contents of the finally block to precede all possible exit statements (return, throw) inside the `try` block.
