---
title: The case for decorators in CFML
desc: The CFML language doesn't have first class support for object decorators. I think it would be pretty useful if they did. Here's one way I would use them.
img: /img/2023/jake-melara-2k26mRosr2o-unsplash.jpg
date: 2023-11-17
tags:
  - cfml
---

![A man stands with his back to the camera in a scraggly field on a dreary gray day with his hands down at his sides, and a variety of papers hover in the air around him at jaunty angles](/img/2023/jake-melara-2k26mRosr2o-unsplash.jpg)
Photo by <a href="https://unsplash.com/@jakemelara?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Jake Melara</a> on <a href="https://unsplash.com/photos/man-standing-on-grass-2k26mRosr2o?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>{class="photo-byline"}

I work really hard not to have to write any CFML any more, but it always seems to claw its way back into my life.

I have a product in production (its 8 year go-live anniversary is tomorrow! 🍰) that uses CFML and the CFML ORM (based on Hibernate). The vast majority of this code was written 6+ years ago and continues to hum along nicely, doing its job just fine. So, when a request to add atomic-change auditing to certain data updates slid into my inbox, I braced myself and dove back into the code.

## What's an atomic change?

Assume you have a database table (`Jouplers`) with many columns. Now assume that users occasionally update existing rows. Now assume that you want to look back at your audit logs and see that Jane Doe changed the value of the `splork` column from `fluargh` to `nerk` last Friday at 4:53pm.

The naïve approach is to log the entire record before and after the change in the audit log and let the person who needs to know what changed deal with diffing the two data blobs and figuring out what changed. That's not very kind, it increases the data storage cost, and also we were specifically asked for atomic change logging so I guess we should do that instead.

An atomic change is just the bits that changed. In the example above, the atomic change would be `(Jouplers #9417021) splork: fluargh -> nerk`. You can represent that a million different ways, but the point is that it only shows the information you need to understand what changed, rather than the entire contents of the record before and again after the change. It was the `Jouplers` table, record # `9417021`, and the `splork` column changed from `fluargh` to `nerk`.

## How do you skin that cat?

I considered a variety of different approaches. None of them felt right, mostly because they would all be verbose to use and require modifying a LOT of existing code.

Other than the approach that I will outline below, the one that came the closest to satisfying my requirements was to use database triggers to respond to the fact that the row changed and do the diff and logging in the handler. Setting aside for a moment the fact that even just the idea of DB triggers give me a fatal case of HELLLLL-NOOOOOO, we don't have any other triggers and I don't think anyone on my team has any recent experience working with them, so it would not be a good fit for our stack.

## My solution

At some point I remembered that CFML supports `onMissingMethod` in its components, and I could use (a bastardized version of) the decorator pattern to encapsulte an ORM entity, intercept invocations of its getters and setters, use that as an opportunity to check for changes and store them in memory in anticipation of a later request for the list of changes.

Before I show you the code for how the object works, let's first look at how you use it. Here's an example of how the code would look BEFORE adding my decorator:

```js
transaction {
	var joupler = entityLoadByPK('Jouplers', 9417021);
	joupler.setSplork('nerk');
	//don't forget the other 75 columns that might
	//need to be updated here...
	entitySave(joupler);
}
```

And after:

```js/1,2,6
transaction {
	var __entity__ = entityLoadByPK('Jouplers', 9417021);
	var joupler = new com.atuttle.AtomicORMEntity(__entity__);
	joupler.setSplork('nerk');
	//don't forget the other 75 columns that might
	//need to be updated here...
	entitySave(joupler.__getEntity__());
	saveAuditLog(..., joupler.__getChanges__());
}
```

What about this approach makes it appealing? The only modifications to existing code are to add the new wrapper around the entity once it's loaded (as close as we can get to a real "decorator"), and to get it back out of the entity when we're ready to save it.

This turns out to be the whole reason for this article. I talked about this project on [my podcast](https://workingcode.dev) and some of the listeners in the [podcast discord](https://workingcode.dev/discord) got to discussing it, and it didn't make sense to give a full accounting of this code in discord and not share it here.

Other than those two things (and getting the changes for auditing, which would need to be done somehow anyway, so I'm not counting that), this is _entirely transparent_ to the existing code. And remember, there are (many) dozens of setters being called, per entity. And this is a big app with many entities.

I got some guff in the podcast discord when I shared screen shots of this code in action, because apparently [getters and setters are evil](https://www.infoworld.com/article/2073723/why-getter-and-setter-methods-are-evil.html) (link provided by guffers). 🤷🏻‍♂️ The code is the way it is, and work has to continue. I don't have time in my budget to build hydration methods that take an object of properties and hydrate the entity into each ORM entity in the project.

Build a time machine, then go back and take it up with the developers that wrote that code in 2016. And then do me a favor and get some of that McDonald's Szechuan sauce on your way back.

## How it works

Here is a very basic, incomplete example that I think does a decent job of painting the picture for what we're trying to accomplish.

```js
component {

	variables.entity = nullvalue();
	variables.changes = [];

	function init(entity){
		variables.entity = arguments.entity;
		return this;
	}

	function onMissingMethod(
		string missingMethodName,
		struct missingMethodArguments
	){
		if (left(arguments.missingMethodName, 3) == 'set') {
			var propName = right(
				arguments.missingMethodName,
				len(arguments.missingMethodName) - 3
			);
			var newValue = missingMethodArguments[1];
			return __set__( propName, newValue );
		} else {
			return invoke(
				variables.entity,
				missingMethodName,
				missingMethodArguments
			);
		}
	}

	private function __set__(
		required string propName,
		newValue
	) {
		var getter = function(){
			return invoke(variables.entity, 'get' & propName);
		}
		var setter = function( x ){
			return invoke(
				variables.entity,
				'set' & propName,
				[x]
			);
		}

		var trackable = __isTrackableProp__(
			arguments.propName,
			arguments.newValue
		);
		if (trackable){
			var currentVal = getter();
			if ( currentVal != arguments.newValue ) {
				variables.changes.append({
					'field': arguments.propName,
					'from': currentVal,
					'to': arguments.newValue
				});
			}
		}
		setter(arguments.newValue);
		return this;
	}

	private function __isTrackableProp__(
		required string propName,
		newValue
	){
		//if you're trying to SET an entity as a value,
		//we don't care to track that...
		if (isObject(newValue)) {
			return false;
		}
		//if it's an array, that can only be useful to pass
		//an array of entities for a relationship
		if (isArray(newValue)){
			return false;
		}
		//if the current value is an entity, we don't
		//care to track that...
		var current = invoke(
			variables.entity,
			'get' & propName
		);
		if (isObject(current)) {
			return false;
		}
		//if it's an array, that can only be useful to pass
		//an array of entities for a relationship
		if (isArray(current)){
			return false;
		}

		//otherwise, we should be able to track that...
		return true;
	}

	public function __getEntity__() {
		return variables.entity;
	}

	public function __getChanges__(){
		return variables.changes;
	}

}
```

Still with me? Let me summarize the code above:

- Constructor accepts an ORM entity as an argument and stores it in a private variable
- `onMissingMethod` exists to intercept all methods being called on the entity. If it's a setter, we'll pass that to our custom `__set__` method that has the special sauce, else just proxy the request to the original method since it's not something we care about.
- `__set__` is where the magic happens. In addition to setting the value on the entity, it also checks to see if the value changed, and if so, stores the change in memory for later retrieval.
- `__getEntity__` returns the possibly-modified entity back to the calling code for saving.
- `__getChanges__` returns the list of changes that were tracked by the decorator, if any.

There are a few other details that help make that all work, but at its core, that's what's going on.

As a reminder, the entire reason I'm writing this article is to explain why `__getEntity__()` is necessary to certain people. Hopefully the above code made the point.

But, we've come this far, and I cut quite a bit out of the component above (as well as adding lots of linebreaks to make it more easily readable in this format) in order to keep the length down. I'll go the last mile and include the entire content of the component below in case anyone wants to follow in my footsteps.

But before I do that, here's my final thought on the whole decorators thing.

## But what about Decorators?

As I mentioned, CFML doesn't currently have any first-class support for decorators. There are of course a variety of ways that they could be implemented, and I'm not interested in staring into that particular navel right now. But if we had decorators, how might this have all been different?

The only significant difference it would have made would be to remove the need for calling `joupler.__getEntity__()` in this line:

```js
entitySave(joupler.__getEntity__());
```

A true decorator would be able to behave as if it were the object being decorated, which means it could be passed as the argument to `entitySave()` in this case:

```js
entitySave(joupler); //this is the decorated Joupler entity
```

## The full code

I'm not going to explain every difference between this and the shorter version above, other than to say this: The vast majority of the differences you'll notice stem from the fact that the concept of `null` is just an afterthought sort of stuck on to the side of the CFML language with some chewing gum and a bit of re-used duct tape. There's a lot of jumping through hoops in order to handle all of the various places you need to be thinking about nulls, and the various ways that nulls can be problematic.

Anyway, here's Wonderwall:

```js
component {

	variables.entity = 0;
	variables.changes = [];

	function init(entity){
		variables.entity = arguments.entity;
		// writeDump(var=variables.entity, top=1);abort;
		return this;
	}

	function onMissingMethod(string missingMethodName, struct missingMethodArguments){
		if (left(arguments.missingMethodName, 3) == 'set') {

			if ( len(missingMethodArguments) > 1 ){
				//not a "dumb"/generated setter, probably a custom method we added to the entity
				return invoke(variables.entity, arguments.missingMethodName, arguments.missingMethodArguments);
			}

			var propName = right(arguments.missingMethodName, len(arguments.missingMethodName) - 3);
			var newValue = missingMethodArguments[1]; //we know there's only 1 arg from the check above
			return __set__( propName, isNull(newValue) ? nullvalue() : newValue );
		} else {
			return invoke(variables.entity, missingMethodName, missingMethodArguments);
		}
	}

	private function __set__( required string propName, newValue ) {
		var getter = function(){ return invoke(variables.entity, 'get' & propName); }
		var setter = function( x ){ return invoke(variables.entity, 'set' & propName, [isNull(x) ? nullvalue() : x] ); }

		if (isNull(arguments.newValue) && isNull(getter())) {
			//don't track this "change"
		} else if (__isTrackableProp__(arguments.propName, arguments.newValue)){
			var currentVal = getter();
			if (
				(isNull(getter()) && !isNull(arguments.newValue))
				|| (!isNull(getter()) && isNull(arguments.newValue))
				|| (currentVal != arguments.newValue)
			) {
				variables.changes.append({
					'field': lcase(left(arguments.propName,1)) & right(arguments.propName, len(arguments.propName) - 1),
					'from': isNull(currentVal) ? '(NULL)' : currentVal,
					'to': isNull(arguments.newValue) ? '(NULL)' : arguments.newValue
				});
			}
		}
		setter(isNull(arguments.newValue) ? nullvalue() : arguments.newValue);
		return this;
	}

	private function __isTrackableProp__(required string propName, newValue){
		//if you're trying to SET an entity as a value, we can't track that...
		if (!isNull(newValue) && isObject(newValue)) {
			return false;
		}
		//if it's an array, that can only be useful to pass an array of entities for a relationship
		if (!isNull(newValue) && isArray(newValue)){
			return false;
		}
		//if the current value is an entity, we can't track that...
		var current = invoke(variables.entity, 'get' & propName);
		if (!isNull(current) && isObject(current)) {
			return false;
		}
		//if it's an array, that can only be useful to pass an array of entities for a relationship
		if (!isNull(current) && isArray(current)){
			return false;
		}

		//otherwise, we should be able to track that...
		return true;
	}

	public function __getEntity__() {
		return variables.entity;
	}

	public function __getChanges__(){
		return variables.changes;
	}

}
```
