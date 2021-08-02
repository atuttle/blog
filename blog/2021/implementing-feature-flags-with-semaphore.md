---
title: Implementing Feature Flags with Semaphore
date: 2021-08-02
tags:
  - semaphore
  - open source
commentsPostId: implementing-feature-flags-with-semaphore
---

Recently I wrote about [Semaphore][semaphore], a new open source cfml feature flags library I released. The library itself is simply a decision engine. You provide it a set of rules (native CFML data types arranged in a specific way), and then you can ask if any given rule is enabled for a user by providing (1) the rule name and (2) a data packet representing the user (again, native cfml data types).

At the time it was a prototype because it seemed like it should work fine but I hadn't actually implemented it in my application yet. Well, that's changed. We're running Semaphore in production now. 🥳

> **I'm not saying that it's bulletproof! We're a sample size of 1 with a trial run time measured in (single-digit!) days at the time of writing. But that's better than nothing.**

As expected, using Semaphore required creating a `featureFlagService` in my application. That service is responsible for saving and loading the flag data (semaphore doesn't provide a storage mechanism), and it provides some helpers and wrappers to make working with feature flags very simple.

The reason it's not part of the Semaphore project is that it's specific to our framework ([FW/1][fw1]), and our application architecture, so it won't be useful to you without significant modification. But I'm sure you want to see it anyway, so [here's a gist of my entire featureFlagService.cfc][featureflagservicegist]. If you want more explanation, keep reading!

In addition to this service, we also have some wiring to do in controllers. But I'm getting ahead of myself.

### How to create your own featureFlagService

What steps would you need to take if you were going to write your own `featureFlagService` specific to your application?

Let's start with the basics. On initialization, wait for dependencies to be wired, and then load the current flag data into memory. Here's my implementation:

```js
// featureFlagService.cfc

public function init( required utilService ){
	variables.utilService = arguments.utilService;

	//load current feature flags
	this.refreshFlagsFromAPI();
}

public void function refreshFlagsFromAPI(){
	variables.semaphore.setAllFlags( this.getAllFlagsFromAPI() );
}

private struct function getAllFlagsFromAPI(){
	var apiResponse = variables.utilService.httpGet( variables.apiURL );
	if ( !isJson(apiResponse.fileContent) ){
		throw(message: "Feature Flag API response is not valid json! 😱", detail: apiResponse.fileContent);
	}
	var flags = deserializeJson( apiResponse.fileContent );
	return flags;
}
```

As you can see above, on initialization we're going to be making an HTTP request to get some data from an API. We're expecting a JSON response, and then when we get a valid response we call `semaphore.setAllFlags( flagData )`.

The code is organized this way so that we can run additional flag-data-updates on demand. **That will be useful later.**

Now the application is loaded and the featureFlagService has flag data in memory. How do we evaluate a flag to see if it's on for the current user?

```js
// featureFlagService.cfc

public boolean function flagEnabled( required string flagId ){
	return variables.semaphore.checkForUser( arguments.flagId, getCurrentUserAttributes() );
}

private function getCurrentUserAttributes(){
	return request.featureFlagsUserAttributes;
}
```

Cool! So we can call `featureFlagService.flagEnabled( 'some_flag_name' )` from anywhere in our application and we'll get back a boolean that indicates whether we should treat the flag as on or off. But where does `request.featureFlagsUserAttributes` come from? 🤔

That's another one of those details that you're going to need to work out for yourself, BUT here's how we did it in our FW/1 application:

In our application, all controllers inherit from a `baseController.cfc` class, which we use to do things like enforce role-based authentication in a general way instead of re-implementing it for every action. This also happens to be a great place to stick something that runs early on in every request. In FW/1 applications, if your controller has a `before()` method, it gets called on every request _before_ (hence the name) the controller method specific to the requested action. This is where we're setting `request.featureFlagsUserAttributes`.

So my `admin/baseController.cfc`'s `before()` method looks a little like this:

```js
// admin/baseController.cfc

public function before( rc ){
	//the requested action might not require user to be logged in
	enforceLoginRequirements( rc.action );

	if ( userIsLoggedIn() ){
		loadUserAttributesForFeatureFlags();
	}
}

private function loadUserAttributesForFeatureFlags(){
	var cacheKeyName = 'featureFlagsUserAttributes';
	if ( !request.keyExists( cacheKeyName ) ){
		if ( application.sessionAdapter.has(cacheKeyName) ){
			request[cacheKeyName] = application.sessionAdapter.get(cacheKeyName);
		}else{
			var userAttributes = featureFlagService.buildUserAttributesFromAdminUser( getCurrentUser() );
			application.sessionAdapter.set( cacheKeyName, userAttributes );
			request[cacheKeyName] = userAttributes;
		}
	}
	return request[cacheKeyName];
}
```

Basically, if the user is logged in, then we're going to make sure the request variable is set. If it's not found in the request then we look for it in the user's session. Caching it in the session prevents re-calculation on every request; and the data is unlikely to change often enough to worry about it becoming stale. Worst case scenario the user has to log out and back in to see a change. 🤷‍♂️

The above snippet eventually calls `featureFlagService.buildUserAttributesFromAdminUser( getCurrentUser() )`, so what's in there? It's job is to take the given user and return the data structure that will be useful in rule evaluation:

```js
// featureFlagService.cfc

public struct function buildUserAttributesFromAdminUser( required user ){
	return {
		'cust': configService.getCustomer(),
		'env': configService.getEnv(),
		'userId': user.getUserId(),
		'guid': user.getGuid(),
		'firstName': user.getFirstName(),
		'lastName': user.getLastName(),
		'roles': user.getRoles()
	};
}
```

That almost covers everything you can see in my `featureFlagService.cfc`. In fact it does touch everything once. But there's one more mechanism that's important to the feature flags workflow that I haven't discussed yet: Updating flags and flag statuses in realtime without a deploy...

You know... the _**entire point**_ of feature flags.

It's really quite simple actually. In the same `admin/baseController.cfc`, still in the `before()` method, we have a listener that checks for a specific URL param, and if found, does an immediate on-demand refresh:

```js/6-9
// admin/baseController.cfc

public function before( rc ){
	//the requested action might not require user to be logged in
	enforceLoginRequirements( rc.action );

	// I've changed the parameter name/values in case anyone gets any wise ideas... 🤨
	if ( url.keyExists('peanutButter') && url.peanutButter == "jellyTime" ){
		featureFlagService.refreshFlagsFromAPI();
	}
	if ( userIsLoggedIn() ){
		loadUserAttributesForFeatureFlags();
	}
}
```

In our flag-data admin interface, after flags are updated, we send http requests to each server to notify them that flags have been updated and they should pull down the updated data. None of that is pictured here, because this post doesn't include any portion of my flag-data-admin interface; but hopefully you can see how that should work.

### What's still missing?

I have very much glossed over a few things:

- flag data storage
- flag data api
- flag data admin interface

That's because these things are extremely specific to your application and your environment. I've talked a little bit on [Working Code Podcast episode 32][wc32] about the storage mechanism we're using, but I won't be going into it here.

The API is a simple JSON responder with the current value of the flags data file. It's built into the flag administration interface.

And to be honest, the administration interface I built for managing our flags is _extremely_ crude. I actually got a compliment from a coworker praising me for doing only the bare minimum to get it working -- it's very obviously a developer tool, not something polished enough for non-tech people to mess with. Of course I accepted the compliment as if that was my plan all along. 😳

[semaphore]: /tags/semaphore/
[fw1]: https://framework-one.github.io/
[featureflagservicegist]: https://gist.github.com/atuttle/f695c8f27011ea2e7176e30f57d25a67
[wc32]: https://workingcode.dev/episodes/032-what-comes-after-senior-developer/
