---
title: "Taffy 2.1.0 Released"
summary: "Taffy 2.1.0 Released..."
date: 2013-11-25 09:00:00
tags:
  - taffy
commentsPostId: Taffy-2-1-0-Released
---

Extree, extree, read all about it!

Taffy 2.1 is [here][1]! Another small, semi-frequent release. Since Taffy 2.0 in August, we've (yes, we, not I!) have fixed 5 bugs -- none too big, looks like 2.0 was a really stable release! -- and added 6 new features. As is the new custom, you can read [the full release notes on GitHub][1].

The new feature I'm most excited about is that [method metadata is now passed to onTaffyRequest][2]. This enables neat stuff like adding role-based security as resource-function metadata:

#### Example Resource:

```js
component extends="taffy.core.resource" taffy_uri="/foo" {
	function get() role="read-data" {
		//...
	}
}
```
#### Application.cfc:

```js
function onTaffyRequest(verb, cfc, requestArguments, mimeExt, headers, methodMetadata){

	local.user = (...); //get user from token or something...

	if (structKeyExists(methodMetadata, "role")){
		for (var availableRole in local.user.roles){
			if (availableRole == methodMetadata.role) { return true; }
		}
		return newRepresentation().noData().withStatus(403, "Not Authorized");
	}else{
		//no role required on the method, so allow anyone to use it
		return true;
	}
}
```
Note the new 6th argument to `onTaffyRequest`: `methodMetadata`. You can call it whatever you like; arguments are passed positionally, not by name.

---

This release includes pull requests from [Bill Rawlinson][3], [Jean-Bernard van Zuylen][4], and [Dominic OConnor][5]. Thanks, guys!

---

[1]: https://github.com/atuttle/Taffy/releases/tag/v2.1.0
[2]: https://github.com/atuttle/Taffy/issues/155#issuecomment-27259068
[3]: https://github.com/billrawlinson
[4]: https://github.com/jbvanzuylen
[5]: https://github.com/dominic-oconnor
