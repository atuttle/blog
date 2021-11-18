---
title: "Chaotic Good: Creating Determinism Where None Exists"
desc: "Some solutions are too brilliant for their own good"
img: /img/2021/chaotic-good.jpg
date: 2021-05-14
tags:
  - semaphore
  - adam cameron
  - cfml
  - json
commentsPostId: chaotic-good-creating-determinism
---

I was having a chat with [Adam Cameron][adamcameron] yesterday and bemoaning how, ahem, _certain CFML engines_ do not serialize Structs in a deterministic way. After some back and forth, he hit me with an idea so good that I am still reeling from it the next day. I sang his praises last night while recording a new episode of [Working Code][workingcode] (that episode will publish on 5/26), and yet I still feel the need to shout his brilliance from the mountaintops more. So...

Firstly, what is determinism? It's not a concept unique to programming, but it matters a lot to us. So let's look at it from a programmer's perspective.

## What is determinism?

A function can be said to be **deterministic** if its output can be predicted using only its input (e.g. state of the system has no effect), and repeating the same inputs always produces the same outputs. This function is deterministic:

```js
function add(a, b) {
	return a + b;
}
```

However, this function is NOT deterministic:

```js
function maths(a, b) {
	return a + b + mouse.x * mouse.y;
}
```

It would be easy to confuse determinism and pure functions, so while we're on the subject, what makes them different? A pure function is a deterministic function that also _produces no side-effects_. This function is deterministic but not pure:

```js
function add(a, b) {
	stdout.print(a + b);
	return a + b;
}
```

Ok, so with that now understood, what did I mean about some CFML engines not having a deterministic implementation of `serializeJson()`?

## When is serializeJson non-deterministic?

Given a struct created using _ANY_ method; not necessarily the implicit object notation shown here:

```js
data = {
	A: 1,
	B: 1,
};
```

If your `serializeJson()` implementation _always_ returns this json, then it is deterministic:

```json
{ "A": 1, "B": 1 }
```

Likewise, it is also deterministic if if _always_ returns this json:

```json
{ "B": 1, "A": 1 }
```

Determinism isn't about the value created, it's about the consistency of that value. If the output depends on whether the struct was created using implicit object notation vs other methods (structNew, deserializeJson, etc), then it is not deterministic. A non-deterministic implementation might return the first version in some situations, and the second in others.

But why is this bad?

## Why do I care if the generated JSON is deterministic?

JavaScript objects are not ordered. From [json.org](https://www.json.org): "An object is an unordered set of name/value pairs." Thus, a nondeterministic implementation of `serializeJson()` is _fine_ if your goal is to create json useful to a JavaScript system or anything else that would consume that data back into its own primitives.

In my case, I'm using JSON as a waypoint in a chain of operations to take any hypothetical struct and _deterministically_ convert it into a number between 0 and 1. Basically, I'm trying to implement this:

```js
checksum({ foo: "bar", baz: "yo" }); //returns numeric between 0-1
```

My implementation _must_ be deterministic in order to be useful. It's not all that dissimilar from calculating an MD5 hash of something, except my output is numeric and MD5 is alpha-numeric, and MD5 only accepts string inputs.

In fact, that is my algorithm: Convert the struct to a string, MD5 hash that string, and remove the alpha-characters, leaving only digits behind. How do you turn a given random struct to a string in CFML? There are a few ways: JSON, WDDX, or XML all immediately spring to mind. I happen to use JSON daily so it's my go-to in a situation like this.

MD5 is deterministic. This is one of the reasons it has been used for so long for password hashing. It wouldn't be useful in a password hashing algorithm if it weren't deterministic, because logins using the correct password would fail at random.

But my function _must_ be deterministic, and `serializeJson()` is not; at least not on all CFML engines, and the thing I'm building will be open source and could potentially run on all modern CFML engines.

This is where Adam Cameron's brilliance comes in.

## How do you add determinism where none exists?

And here we are. We've reached the crux of this article. This is so ["chaotic good"][alignment] and I absolutely love it.

Adam's idea was to **sort the characters in the JSON output string.** That's it. It's that simple.

Since the resulting JSON output characters (just not the order in which they appear) is deterministic, sorting the string makes it deterministic. And since I don't need the ability to deserialize back to primitives, it's totally fine.

Going back to the original two examples of nondeterministic JSON, after sorting they both look like this:

```
,::""""{}11AB
```

Adam, you are truly an evil genius.

I'm looking forward to sharing more about this open source project in the near future, but thanks for letting me tell that story in the meantime.

[adamcameron]: https://blog.adamcameron.me
[workingcode]: https://workingcode.dev
[alignment]: https://www.gamersdecide.com/articles/dnd-alignments-explained
