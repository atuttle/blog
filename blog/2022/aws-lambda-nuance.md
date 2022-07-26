---
title: Global node.js variables are safe to use in AWS Lambda
desc: There's a non-obvious benefit to the way that AWS implements lambda concurrency and it's worth considering.
img: /img/2022/sigmund-aI4RJ--Mw4I-unsplash.jpg
date: 2022-07-26
tags:
  - aws
  - architecture
  - javascript
---

![Close up photograph of the "recycle" symbol on a recycling bin](/img/2022/sigmund-aI4RJ--Mw4I-unsplash.jpg)

Photo by <a href="https://unsplash.com/@sigmund?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Sigmund</a> on <a href="https://unsplash.com/s/photos/recycle?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>{class="photo-byline"}

In general, global variables are [frowned upon](https://stackoverflow.com/questions/5063878/how-to-cleanly-deal-with-global-variables).

In fact, they can be dangerous. If you have a Node.js application running an Express web server, and you read and write global variables at various points during a request, it is a near certainty that you'll experience race conditions and variable leakage under even modest request concurrency.

Given the multiple-request model of Express[^1], if you write a global variable during a request, and then later reference that same global variable during the same request, there is no guarantee that it will contain the same value that you previously wrote.

**So then, it is _incredibly important_ to understand where and how your application is running, and what the benefits and limitations of that environment are.**

[^1]: I don't mean to pick on Express here, it's not a problem unique to their implementation, but it's an ecosystem that the average Node.js developer should be familiar with, so it's a useful model for illustration purposes.

The way that Amazon Web Services [implements concurrency](https://aws.amazon.com/blogs/compute/understanding-aws-lambda-scaling-and-throughput/) for Lambda functions is, to over-simplify, that you can have up to N concurrently-available containers ("environments" if you don't want to use a word that evokes Docker), but that each container will have its own segregated memory, and each container will only ever handle 1 request at a time. Once a request completes, its container can be reused if there are pending requests, and any global state left at the end of the first request will be set and available at the start of the next.

That's it. That's the point. If you're good enough at reading between the lines, that's all there is to learn here.

## But why would you do this?

As previously mentioned, global variables are generally frowned upon. So why is it a good thing that they're safe to use in this scenario? Here's a concrete example that illustrates the benefit.

Suppose you're writing a Lambda function and you want to log every exception that it throws to some external logging service (other than just the default CloudWatch logs). First, you write a utility function to send the thrown exceptions to your logging service:

```js
async function logError(error, context) {
	const logResult = await fetch('https://...', {
		method: 'POST',
		body: JSON.stringify({ error, context })
	});
	if (!logResult.ok) {
		console.error('Error while sending an exception to the log service! 😱');
		console.error({ error, context });
	}
}
```

This function makes an HTTP POST request containing the error object and the context object serialized to JSON for logging purposes. The `error` argument is self-explanatory: it's the error that was thrown. Perhaps less obvious is `context`. The intention here is to give the developer the opportunity to provide any additional details that might be helpful in diagnosing the problem. For example, what were the inputs to the Lambda request? What were some midpoint findings during the execution, before the exception was thrown? Having these details can be the difference between finding a root cause and not being able to diagnose an issue at all.

Now we need to use it in our Lambda function:

```js
const logError = require('./logError');

exports.handler = async (event) => {
	const s3Bucket = event.Records[0].s3.bucket.name;
	let found = false;
	let count = 42;
	try {
		//do something useful
	} catch (error) {
		logError(error, { found, count, s3Bucket });
	}
};
```

Again, this seems pretty straight-forward, and global variable usage hasn't shown itself to be useful yet.

But.

Are your Lambda functions truly that simple? An average one of mine might have 5 or 6 local utility libraries for managing database and redis access, piping messages to our team chat, validation, and so on. There's not just layers to the functionality, there are _strata_.

Consider that you might want to collect a bunch of information along the journey through your code to include in an error log, if the need should arise. You could pass it down through each method call. Equally tedious, if you want to access some context from several layers up the stack for an error thrown much lower.

Here I'm highlighting all of the lines that are less clean than they could be, because of the prop drilling.

```js/5,8,11,15,20
exports.handler = async (event) => {
	const s3Bucket = event.Records[0].s3.bucket.name;
	let found = false;
	let count = 42;
	//... useful things ...
	await makeWidgets(s3Bucket, { found, count });
};

async function makeWidgets(bucket, context) {
	//... useful things ...
	if (inventoryCount < minInventoryCount) {
		await warnAboutInventoryCount(bucket, context);
	}
}

async function warnAboutInventoryCount(bucket, context) {
	//what if something goes wrong?
	try {
		//... useful things ...
	} catch (error) {
		logError(error, context);
	}
}
```

For those familiar with React.js, this feels a lot like the [prop drilling](https://kentcdodds.com/blog/prop-drilling)[^2] problem. Potentially many functions in the middle of a chain of function calls need to support context as input and pass it on to functions called later, without ever using it or adding to it, all because something at the end of the chain might need it. This gets tedious and feels _bad_ and _wrong_, even if you can't articulate why.

[^2]: The irony is not lost on me: I'm advocating for usage of global variables (_in a well-defined scenario!_) and linking to an article that says that prop drilling is a useful solution for using global variables. I agree that globals are bad in a React application for all of the reasons Kent explains.

## Global Variables to the Rescue

It should be noted that this is not a general purpose solution that will work in all scenarios, but in the specific scope of this article (AWS Lambda), this is a useful tool. {class="call-out"}

If we make a small tweak to our error logging function to expect and use a global context variable, and add a method for appending additional context for any later error reports, then our code becomes cleaner and easier to understand and maintain, and accomplishes the same goal.

```js
function addDebugContext(context) {
	global.debugContext = Object.assign({}, global.debugContext, context);
}

async function logError(error, context) {
	if (context) addDebugContext(context);

	const logResult = await fetch('https://...', {
		method: 'POST',
		body: JSON.stringify({ error, context: global.debugContext })
	});
	if (!logResult.ok) {
		console.error('Error while sending an exception to the log service! 😱');
		console.error({ error, context: global.debugContext });
	}
}
```

With the updated logging context approach, our application can be simplified thusly:

```js
const { addDebugContext, logError } = require('./logError');

exports.handler = async (event) => {
	const s3Bucket = event.Records[0].s3.bucket.name;
	let found = false;
	let count = 42;
	addDebugContext({ found, count });
	//... useful things ...
	await makeWidgets(s3Bucket);
};

async function makeWidgets(bucket) {
	//... useful things ...
	if (inventoryCount < minInventoryCount) {
		await warnAboutInventoryCount(bucket);
	}
}

async function warnAboutInventoryCount(bucket) {
	//what if something goes wrong?
	try {
		//... useful things ...
	} catch (error) {
		logError(error);
	}
}
```

With this approach, the job of storing useful context for debugging is done along side the creation or discovery of that context, and doesn't need to be whispered down the lane in order to be available for inclusion in any incidental error logging that happens anywhere down that rabbit hole.

Of course, this leaves the previous invocation's context in place when the next invocation starts, so you'll want to do a "reset" at the start of every invocation just to make sure the global variables are in a clean and useful state for the invocation that's starting:

```js
//add this to logError.js
function resetDebugContext() {
	global.debugContext = {};
}
```

```js/3
const { resetDebugContext, addDebugContext, logError } = require('./logError');

exports.handler = async (event) => {
	resetDebugContext(); //clear context from previous invocations
	// ...
};
```
