---
title: 'Enforcing Limitations on your Taffy-powered API'
summary: 'Enforcing Limitations on your Taffy-powered API...'
date: 2010-10-18 08:00:37
tags:
  - taffy
---

You might be one of those people want to open up access to create, update, and delete your data via your API to the entire world with no restrictions; but it's not likely. A common need for APIs is defining and enforcing limitations such as API keys and authentication, rate limiting, logging, and so on.

Taffy provides a hook that allows you to allow or deny a request to continue, on a per-request basis, with [onTaffyRequest](http://github.com/atuttle/Taffy/wiki/Index-of-API-Methods#onTaffyRequest).

When you define `onTaffyRequest` in your Application.cfc, it is called for each request and sent all of the information it needs to process the request:

- HTTP Verb
- Name of the CFC that would respond to the request
- All request arguments, including tokens extracted from the URI and Query String/Put/Post parameters.
- Requested Mime Type (json, xml, etc)
- And (as of Taffy 1.1) a structure of the HTTP request headers

The default implementation, (when you _don't_ override it) always returns `TRUE`; and, in the event that you would like to allow the request to continue so that your resources are allowed to do their thing, your implementation of `onTaffyRequest` should return `TRUE` as well.

If, on the other hand, you want to abort the request -- because login failed, or the customer owes you money, or they are over their rate limit (these are business rules and up to you to implement) -- then you should return a **representation instance**. This is just an instance of the object that serializes result data into the requested format, except in this case it will be used to tell the API consumer that, and hopefully _why_, their request is not allowed to continue.

Let's say that you're using the default representation class that comes with Taffy (capable of JSON serialization using ColdFusion's native `SerializeJSON` method), and you want to abort the current request:

```js
function onTaffyRequest(verb, cfc, requestArguments, mimeExt, headers){
	var o = StructNew();
	if (/* customer owes you money */){
		o.msg = 'Your account is overdue. Please call Accounts Payable at 555-867-5309.';
		return newRepresentation().setData(o).withStatus(403);
	}
	//all checks passed, let the request continue
	return true;
}
```

The method `newRepresentation` will be available in Taffy 1.1; in the meantime, you will need to instantiate the representation object manually. If your default representation class is the Taffy default (`taffy.core.genericRepresentation`), then you would do so this way:

```js
var r = createObject('component', 'taffy.core.genericRepresentation');
return r.setData(o).withStatus(403);
```

Obviously, substitute your custom representation class cfc path there, if you're using a custom class; so that the result can be serialized to XML, or YAML, or whatever format it is that your API supports and the consumer is expecting their results to be in.

The status code I've used here is 403, which is the official HTTP Status Code for "Not Allowed". You should probably familiarize yourself with [HTTP Status Codes](http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html), and maybe print it out and keep it handy. They are an important part in the way REST APIs work.

Doing all of this allows Taffy to respond to the request in a RESTful manner that the consumer software can understand (for example, as json/xml/etc) while still preventing unauthorized access.
