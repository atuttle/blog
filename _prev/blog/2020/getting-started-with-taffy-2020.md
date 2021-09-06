---
title: Getting Started with Taffy, 2020 Edition
date: 2020-09-10
tags:
  - taffy
commentsPostId: getting-started-taffy-2020
---

Recently a friend asked me for tips on getting started with [Taffy](https://taffy.io/) -- my framework for building REST API's in CFML.

I sent him a link to the [guides](https://taffy.io/documentation.html#guides) but with the caveat that those are pretty old by now (looks like most of them are from 2012-2014! 😬) but they should be at least mostly still relevant.

But the truth is, Taffy is built specifically to be dead simple to get on its feet, and capable of doing anything you need to do in a REST API. So here's a quick getting started brain dump, 2020 edition. It's written for someone with a passable understanding of how REST works who just needs to understand how to make Taffy do that work for them. If you're looking for more detail on exactly what REST is, why, how, etc, I wrote a book for you: [REST Assured](https://restassuredbook.com).

## Library location / mapping

Either place the `taffy` folder in your web root (no danger in that), or create a mapping for `/taffy` to wherever you have it available.

## Application.cfc

Yes, your API needs its own `Application.cfc`. _**The Taffy Way**_ is for the API to live in its own folder separate from your user-facing application if you have one. For example: `/api/v1/`.

Your Application.cfc should extend `taffy.core.api`, and have a name. That's all that's _required_ but you'll probably want to do more:

```js
component extends="taffy.core.api" {
	this.name="my_awesome_api";
}
```

Taffy implements `onApplicationStart()`, `onRequestStart()`, `onRequest()`, and `onError()` so if you need to add your own code to these methods, make sure to call the appropriate super function:

```js
component extends="taffy.core.api" {
	this.name="my_awesome_api";

	function onRequestStart(targetPath){
		request.foo = "bar";
		super.onRequestStart(arguments.targetPath);
	}
}
```

Whether you call the super function before or after your code additions is up to you. Think about what the framework does at that moment in time, what you're trying to add, and what the best order of operations should be. It is conceivable to have code before and after for a variety of purposes.

The next thing to know about Application.cfc is that you may add some configuration in [variables.framework](http://docs.taffy.io/3.2.0#variablesframework-settings) -- though again, this is entirely optional. That link shows the default configuration, so you only need to include/change bits that you want to be different. Each setting is loaded/defaulted individually so that you can use the object shorthand syntax `variables.framework = { ... };` to specify only the settings you want to override, and the rest will still use their defaults.

>**Homework:** You're probably pretty quickly going to want to be able to intercept and inspect an incoming REST request before Taffy passes it on to your handler code. Think about things like rate limiting, API key validation, etc. Things that you'll want to apply broadly to most if not all of your API surface area. To do that, Taffy allows you to implement an `onTaffyRequest()` method in your Application.cfc. Your response from that method determines whether or not the request continues; and you can also modify the request before it does, if you wish. Just make a note of this fact, and come back to [read the docs on onTaffyRequest()](http://docs.taffy.io/3.2.0#ontaffyrequest) when the time is right.

## index.cfm

You need an `index.cfm` to go along with your `Application.cfc`. It doesn't matter what's in it; it will never be executed -- blank is fine. It just has to exist so that your HTTP server (e.g. Apache) will route the incoming request to CFML to handle.

## &lt;breakpoint&gt;

You now have a functioning API. It can't _do anything_ but that's beside the point. It accepts REST calls and will return 404 for most reasonable requests because it doesn't know about any routes to things. But it's a REST API, and if you're using all of the framework defaults, you did that in as little as 3 lines of code spanning 2 files. That's pretty great, right?

Ok, let's get back to work...

## A quick note on vocabulary

Half of what REST is about is URL's, so routing is an important part of any REST framework. This is more of a general REST thing than a Taffy thing, but you should familiarize yourself with the concept of Collections and Members. A collection is multiple records of the same type (e.g. from the same database table), and a member is one of those records. `/widgets` is a collection, while `/widgets/42` is a member.

## Adding resources / routes

One of Taffy's primary goals is to give you a way to easily provide something resembling traditional REST URL's. Let's start by creating a widgets collection resource. First, create a `resources/` folder adjacent to your Application.cfc and index.cfm, and in it place a CFC that extends `taffy.core.resource`:

```js
component
extends="taffy.core.resource"
taffy_uri="/widgets"
{

	function get(){
		return representationOf( queryExecute("select * from widgets") );
	}

}
```

Here you can see we've also added component metadata named `taffy_uri`, and a method named `get`. In that `get` method, we make use of another function `representationOf`. Let's explain what these things do:

The component metadata `taffy_uri` tells taffy that this CFC is responsible for handling all requests to the url `index.cfm/widgets`. So if your domain was example.com and you used the suggested `/api/v1` folder structure, the full URL would look like this: `http://example.com/api/v1/index.cfm/widgets`. I wish that the index.cfm didn't have to be there, but it does. (You can [use URL rewriting to get rid of it](https://github.com/atuttle/Taffy/wiki/URL-Rewrite-Rule-Examples), but that's an exercise left for the reader.) No matter the verb, any request that comes in to `/widgets` will be handled by this CFC.

The reason our example method was named GET was so that it will respond to the HTTP GET method. To respond to POST you implement a method named POST. To respond to PUT you make a method named PUT, and DELETE for DELETE. You should never have to implement OPTIONS, Taffy handles these requests for you.

**As you may already know, REST is mostly about HTTP verbs and URLs, so here we've already figured out the basics.**

- GET returns existing data
- POST inserts new data
- PUT updates existing data or inserts new when you are including the new primary key value in the payload
- DELETE deletes data

Of course the implementation details of each of those are left to you.

Of the three new concepts introduced in the last code sample, all that remains unexplained is `representationOf()`. This is a helper method provided for you by Taffy to help with separation of concerns. Note that I returned a raw query resultset, not a string representation of those results. The `representationOf()` method -- or you can use `rep()` for shorthand if you like! -- does the work of passing your native response data off to a tool that will serialize it appropriately for the client.

### Serialization

By default Taffy uses a serialization class that uses the native `serializeJson()` functionality. If you recall, that method turns CFML queries into JSON, but JSON that's kind of _"special."_ You may want to convert that query into an array of structs before you return it. This is such a common use case that Taffy includes a helper method to do this for you: `queryToArray`, and unlike raw `serializeJson(query)` the column name text-case you used in your query will be preserved -- your object key names won't be in ALL UPPER CASE.

```js
function get(){
	return rep( queryToArray( queryExecute("select * from widgets") ) );
}
```

>**Homework:** queryToArray also takes a 2nd function to act as a callback, which makes it a really powerful utility to have on your toolbelt! When you're ready, [read more about it here](http://docs.taffy.io/3.2.0#querytoarray).

>**Homework:** Taffy completely supports other serialization options by allowing you to implement your own serializer class. And deserializers too, for non-json request body payloads. You can read more about those here: [Serializers](http://docs.taffy.io/3.2.0#custom-serializers), [Deserializers](http://docs.taffy.io/3.2.0#custom-deserializers).

### What about input?

There are a few ways of providing request data to a Taffy request:

1. URI Tokens
1. Query String Params
1. Body params

They are evaluated in the order listed above, and if there are ever conflicts, the last one in wins. So if you have a request with a URI token named foo, a query string param named foo, and a body param named foo, the handler will get one foo argument, and its value will be the one from the body.

Taffy takes care of parsing all of the request data for you and makes it available as arguments to your handler functions.

#### URI Tokens

Specify a token in your `taffy_uri` like `{this}`. So for our widgets **member** CFC, we might write the following code:

`index.cfm/widgets/42`

```js
component
extends="taffy.core.resource"
taffy_uri="/widgets/{id}" {

	function get( id ){
		//id == 42
	}

}
```

URI tokens are required in order to match -- there's no such thing as an optional token. For optional arguments use query string params. For example, a filter:

`index.cfm/widgets?filter=blue`

```js
component
extends="taffy.core.resource"
taffy_uri="/widgets" {

	function get( filter ){
		//filter == "blue"
	}

}
```

Body params are also optional. By default, Taffy is capable of handling both JSON and `application/x-www-form-urlencoded` request payloads. If the request body is JSON, Taffy expects it to be an object. The keys of that object will be passed as arguments to your handler function. If it is not an object -- say it's an array instead -- then Taffy passes the entire body as the argument `_body`.

## Wrapping Up

That covers almost all of the core of REST API functionality. So what's left?

- Status codes
- Response headers

Both of these are easily added to any response by chaining a method onto your existing response:

```js
return rep( someData )
	.withStatus(201, 'Created')
	.withHeaders({ 'x-foo': 'bar' });
```

I know I've written a lot of words here, but if you look carefully, we've written a scary-small amount of code to get a lot of functionality out of Taffy. That was one of the driving forces behind its development!

All of the information in this blog post is covered in even more detail in the [Taffy documentation](https://docs.taffy.io), but hopefully the cherry-picked topics and organizational style of this blog post helped you get on your feet. That was the goal!

><img src="https://restassuredbook.com/assets/img/book-3d.png" alt="Cover art for REST Assured" class="hero" width="100" style="color:black;float:right; margin-bottom:0" />
><strong>If you're looking to learn even more about REST then I suggest you take a look at my book, <a href="https://restassuredbook.com">REST Assured</a>!</strong><br/><br/>It teaches you all of the practical foundational knowledge about REST without getting bogged down in academic restraints that aren't useful in the real world.
><div style="clear:right"></div>
