---
title: 'Using Taffy Without an Application.cfc Base Class'
summary: 'Using Taffy Without an Application.cfc Base Class...'
date: 2013-05-17 16:06:12
tags:
  - taffy
---

One of the most common complaints I hear about Taffy is that it requires that you extend its base class in your Application.cfc...

```js
component extends="taffy.core.api" {}
```

Sometimes you don't want to do this. Maybe you have another base class you're using, or you just don't want to. Whatever your reasons, it's a dealbreaker.

Talking with [Chris Phillips](https://twitter.com/cfchris) at cf.Objective() today, I had an epiphany that it should be possible to get Taffy running without extending `taffy.core.api` from your Application.cfc. The only reason it's been a requirement thus far was to automatically bootstrap in Taffy's handling of the `onApplicationStart`, `onRequestStart`, and `onRequest` events.

But if you're willing to wire those up manually, you can write your Application.cfc any way you like as long as -- at some point -- you hand off the request to the appropriate Taffy method. Here's an Application.cfc that uses Taffy as an internal object without using extends in Application.cfc:

```js
component {

	function onApplicationStart(){
		application.taffy = createObject('taffy.core.api');
		application.taffy.onApplicationStart();
	}

	function onRequestStart(thePage){
		application.taffy.onRequestStart( arguments.thePage );
	}

	function onRequest(thePage){
		application.taffy.onRequest( arguments.thePage );
	}

}
```

You can put whatever you want before and after those calls that defer to Taffy's internal implementations (e.g. the rest of your application), and it should still work exactly as described in the documentation -- `variables.framework` would still be used, etc -- but I haven't tested this extensively yet.

Just a little tidbit that I thought some of you may be interested to hear.
