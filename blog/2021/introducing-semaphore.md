---
title: Introducing Semaphore
description: I've created an open source, minimalistic, feature-flags rules engine for CFML.
date: 2021-05-19
tags:
  - semaphore
  - open source
commentsPostId: introducing-semaphore
---

Today I'm excited to tell you about a new open source project I've been working on, called [Semaphore][github].<sup>1</sup>

It's a minimalist feature flags engine for CFML applications. What's **not** included? Persistence of flag data, and a UI for flag management.

If you're not familiar with what **feature flags** are, I would encourage you to listen to [Working Code episode 18: "Feature Flags (Finally!)"][wcff], or read [Ben Nadel's article explaining how his team uses them][benblog]. Or both.

## Why would I implement my own engine?

Aside from the obvious, "Because I can, and it was fun!" answer?

Why not use an existing service? Well, [LaunchDarkly][launchdarkly] is out of the price range for the balance of what I want to do with it and what I can afford, so that rules it out. I also found [FlagSmith][flagsmith] and [Split.io][splitio], and both have Java SDK's, so I tried using both of them. I was unsuccessful with both of them.

I'm no idiot, but I'm also not a seasoned Java developer. And while CFML is a layer on top of Java, that doesn't mean documentation for Java developers makes sense to me or even correctly explains how you would use the library in CFML. I'm unfamiliar with Maven, which both seem to recommend, and from what I've heard it's not a particularly friendly tool either. When all was said and done I had spent 3-4 evenings of my free time and all I had to show for it was that I proved I wasn't capable of getting either SDK to even load into the most basic usable state in a CFML app.

Since I'm not willing to give up on feature flags, I decided I had one recourse left: roll my own.

## So what _does_ it do?

I told you what it _doesn't_ do (to recap: persistence, UI), so what _does_ it do?

1. Define a <acronym title="Domain Specific Language">DSL</acronym> for defining flags with data primitives (more on that later)
2. Provide <acronym title="Create, Read, Update, Delete">CRUD</acronym> methods for managing flags in memory
3. And provide a method for evaluating whether a given user has the flag turned ON or OFF based on the rules defined in the flags

I can see how a provided UI might be beneficial to people who run a single instance of their application on a single server, but I don't want artificially limit Semaphore's usefulness by making any design decisions for that mental model. That said, it leaves a nice opening if someone wants to develop a companion project. 😉

## How I'll be using it

Instead, I intend to use it in my application by calling it from a service that has the responsibility of loading the flags from my persistence mechanism, and proxying flag-check calls; and writing a separate small application for viewing the state of my flags and managing them in the persistence store. We'll be using Redis, because it's fast, lightweight, and because all of my application instances are already using it for other reasons, so why not?

This should make it easily useful for a multi-tenant, multi-instance, distributed application, which is important to me.

## Defining flags

Here's how you define flags:

```js
semaphore.setAllFlags({
	myFeature: {
		name: 'Flag Name',
		description: 'A brief description of what the flag is used for',

		// if a flag is inactive, it will always return false
		active: true,

		// optional. default: false. set to true to invert the response
		//    => true becomes false, false becomes true.
		baseState: false,

		// The flag will be ON for any user who matches AT LEAST ONE rule
		rules: [
			{
				type: '%',
				percentage: 42
			},
			{
				type: 'filter',
				attribute: 'userId',
				// supported math operators: ==, !=, <, <=, >, >=
				operator: '<=',
				comparator: 42
			},
			{
				type: 'filter',
				attribute: 'role',
				// use "has" operator to find comparator in attribute array
				operator: 'has',
				comparator: 'beta-tester'
			},
			{
				type: 'filter',
				attribute: 'cohort',
				// use "in" operator to find attribute value in comparator array
				operator: 'in',
				comparator: [5,7,9]
			},
			{
				// ON for everybody
				type: 'everybody'
			},
			{
				// OFF for everybody
				type: 'nobody'
			}
		]
	}
});
```

At present, the examples above show all supported rule types. Of course, you should include only the rules you want to apply to your flag.

As the method name shown implies, this method overwrites the entire set of flags with the data you provide. This is useful for bulk-creation at app startup. These methods are all provided and should hopefully be pretty self-explanatory:

```js
void setAllFlags(required struct flags)

struct getAllFlags()

void setFlag(required string flagId, required struct flag)

struct getFlag(required string flagId)
```

## Evaluating flags

Once you have a Semaphore instance on its feet, the next step is to start putting features behind flags. As I mentioned, I'll be wrapping Semaphore in a service because that makes it easy to inject anywhere in my application that I might need it using <acronym title="Dependency Injection">DI</acronym>. It also has the added benefit that my service wrapper can abstract the inclusion of user attributes in flag checks so that I don't have to include it in every flag location.

Here's what Semaphore is expecting you to call to check a flag status:

```js
if (
	semaphore.checkForUser(
		flagId: 'myFeature',
		userAttributes: {
			// the data here is not significant
			// it's included only to give you an idea of what you might want
			userId: 42,
			roles: ['beta-tester','admin','plebe'],
			...
		}
	)
){
	theNewImplementation();
} else {
	theOldImplementation();
}
```

The value for userAttributes should be the same for each user every time they login, assuming the underlying data hasn't changed; so you should probably calculate that as part of login and then cache it somewhere like the user session. That simplifies it a little bit:

```js
if (
	semaphore.checkForUser(
		flagId: 'myFeature',
		userAttributes: session.userAttributes
	)
){
	theNewImplementation();
} else {
	theOldImplementation();
}
```

By wrapping it in a service, I can have the service proxy the call to checkForUser and take over responsibility of including the user attributes argument:

```js
if ( featureFlagService.flagIsOn('myFeature') ){
	theNewImplementation();
} else {
	theOldImplementation();
}
```

**Nice.**

Semaphore is [available on GitHub][github] and near as I can tell it's feature-complete and well tested. I haven't had time to use it in my application YET, so I can't vouch for it. But... SOON. Thanks to Ben and the podcast I am pretty eager to give it a go.

---
<small><sup>1</sup>This is, by the way, the project I was working on when I wrote my recent entry, [Chaotic Good: Creating Determinism Where None Exists][chaotic-good].</small>

[github]: https://github.com/atuttle/semaphore
[wcff]: https://workingcode.dev/episodes/018-feature-flags-finally/
[benblog]: https://www.bennadel.com/blog/3766-my-personal-best-practices-for-using-launchdarkly-feature-flags.htm
[launchdarkly]: https://launchdarkly.com
[flagsmith]: https://flagsmith.com
[splitio]: https://www.split.io
[chaotic-good]: /blog/2021/chaotic-good-creating-determinism-where-none-exists/
