---
title: Multi-Tenant Express.js Redis Sessions
date: 2020-03-20
tags:
  - node.js
  - architecture
commentsPostId: mt-express-redis-sessions
---

Yesterday at work we did what we usually do: Looked at a problem, came up with a solution idea, and when that didn't work we adjusted course until we reached what felt like success. But...

It's working, but it _feels like something that maybe nobody has done before, **and maybe for good reason?**_

I'd like to tell you about what we did, and why we did it, so that if you see some reason this is not a good idea you can let me know. And hey, maybe this is a good approach and we'll solve your problem too. 🤷‍♂️

## The Problem

We need to start a new application using Node, Express.js, and hook it up to Redis for sessions. So far this is pretty normal. Here's how you'd do that for an average app.

```js
const express = require('express');
const session = require('express-session');
const redisClient = require('redis').createClient({ host: getSetting('keyStoreHost') });
const RedisStore = require('connect-redis')(session);

const app = express();
app.use(
	session({
		secret: 'keyboard-cat',
		key: 'cookie-name',
		proxy: 'true',
		resave: false,
		saveUninitialized: false,
		store: new RedisStore({
			client: redisClient,
			ttl: 60 * 60, //1 hour
			prefix: `session:`
		})
	})
);
```

So here's where it gets complicated. We want our application to be [multi-tenant](https://en.wikipedia.org/wiki/Multitenancy), and to identify which customer owns the session for the user making the request, which we can tell from the hostname. We include the customer id, among other things, in our session identifiers: `sessions:customer-abc:etc:`. Partly to allow session sharing between tech stacks and applications, we would very much like to continue taking this approach.

> I suppose it should be noted here that if we were willing to relinquish on that one requirement and have all customers share one pool of sessions, this entire problem kind of goes away. It would make it that much more difficult to find the right redis key on the rare occasion we want to dig up someone's session contents to debug something, and it would require modifying other applications to change their session prefixes, and I am a little bit worried about the idea of session id collisions, but it's possible that it could go fine.

Our first thought was to (my favorite word: "just") wrap the `session()` middleware with a custom function that inspects the request to set a variable that could be consumed via closure in the session middleware. Unfortunately, it's not that simple. Calling `session()` here _returns_ a middleware function, and by that point the value in the `prefix` option is saved in memory and not editable.

I briefly considered the idea of forking **Connect-Redis** or **Express-Session** (or both) to always use a callback to get the `prefix` value, but quickly realized that we don't want to take on any ongoing maintenance of those modules. I guess if it turns out that the callback is a good idea, we may reach out to those developers and ask if they're ok with a PR that adds it as an option. But for now, that idea is tabled.

So here's where we landed:

## The Solution (for now?)

Step 1: A new middleware to identify the customer from the hostname.

```js
app.use((req, res, next) => {
	if (req.hostname in MAP) {
		req.CUSTOMER = MAP[req.hostname];
		return next();
	} else {
		throw new Error(`Unrecognized hostname: ${req.hostname}`);
	}
});
```

Step 2: A new custom middleware-generator that will create new **Express-Session** and associated **RedisStore** instances &mdash;one for each customer, created only once, at startup&mdash; and then return a middleware that will proxy the request to the appropriate session-middleware instance based on `req.CUSTOMER`. I know that sounds complicated and weird when written out, but hopefully it will make more sense written out in code form.

So we start with our `app.use(session(...))` and replace that with a new middleware call:

```js
app.use(dynamicSessions("appName"));
```

That `dynamicSessions` middleware accepts an app name (another part of what we put in the session prefix), and will need to do all of the stuff I described above, so here we go.

This is the implementaiton of `dynamicSessions()`. I'll discuss each chunk as we go, and then give the entire thing in one block again at the end.

First, we need to bring in our dependencies, including a list of customers, and create a hash table where we'll store the instantiated and ready to use session middlewares.

```js
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const redisClient = require('redis').createClient({ host: getSetting('keyStoreHost') });

//for this purpose, just assume this is an array of customer id's:
// ['customer-A', 'customer-B', etc]
const getCustomers = require('./our-customers');

// a hash table to store references to all of the middlewares we're going to generate
const customerSessionMiddleware = {};
```

Then, we need two config objects for the options for express-session and RedisStore that won't be changing between our instances; and a function that we can use to generate the various middlewares based on the two things that will be different between them, the customer id and the app name. I hope that the two objects are self explanatory. The function uses a [spread expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) to expand those objects into a new object, and add on the only thing that's different between each customer, the RedisStore instance and its prefix attribute.

```js
const SessionMiddlewareConfig = {
	secret: 'keyboard-cat',
	resave: true,
	saveUninitialized: true,
	key: 'cookie-name'
};

const RedisStoreConfig = {
	client: redisClient,
	ttl: 60 * 60 //1 hour in seconds
};

const configureMiddleware = (cust, app) =>
	session({
		...SessionMiddlewareConfig,
		store: new RedisStore({
			...RedisStoreConfig,
			prefix: `sessions:${cust.toLowerCase()}:${app}:`
		})
	});
```

And lastly, we need to create the function that we're going to export. It will accept the app name, generate all of the necessary middlewres (one for each customer) and store them in the hash table we previously created; and then it will return a new function that Express will hold onto. That function will inspect the request for the `req.CUSTOMER` key we created with our other middleware, use that to select the appropriate session middleware from the hash table, and proxy the invocation to that middleware.

```js
const dynamicSessions = app => {
	//load all session stores up once at startup
	getCustomers().forEach(cust => {
		customerSessionMiddleware[cust] = configureMiddleware(cust, app);
	});

	return function dynamicSessionMiddleware(req, res, next) {
		const customerMiddleware = customerSessionMiddleware[req.CUSTOMER];
		return customerMiddleware(req, res, next);
	};
};

module.exports = dynamicSessions;
```

So then once again, here it is all together:

```js
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const redisClient = require('redis').createClient({ host: getSetting('keyStoreHost') });

//for this purpose, just assume this is an array of customer id's:
// ['customer-A', 'customer-B', etc]
const getCustomers = require('./our-customers');

// a hash table to store references to all of the middlewares we're going to generate
const customerSessionMiddleware = {};

const SessionMiddlewareConfig = {
	secret: 'keyboard-cat',
	resave: true,
	saveUninitialized: true,
	key: 'cookie-name'
};

const RedisStoreConfig = {
	client: redisClient,
	ttl: 60 * 60 //1 hour in seconds
};

const configureMiddleware = (cust, app) =>
	session({
		...SessionMiddlewareConfig,
		store: new RedisStore({
			...RedisStoreConfig,
			prefix: `sessions:${cust.toLowerCase()}:${app}:`
		})
	});

const dynamicSessions = app => {
	//load all session stores up once at startup
	getCustomers().forEach(cust => {
		customerSessionMiddleware[cust] = configureMiddleware(cust, app);
	});

	return function dynamicSessionMiddleware(req, res, next) {
		const customerMiddleware = customerSessionMiddleware[req.CUSTOMER];
		return customerMiddleware(req, res, next);
	};
};

module.exports = dynamicSessions;
```

I've got this deployed in a sandbox, and it seems to be working well. Load testing doesn't show any memory leaks, and everything seems to work as expected.

So, internet, what boogeymen are lurking in the shadows here? Why is this a terrible idea?
