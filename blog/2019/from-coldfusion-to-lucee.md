---
title: Moving from Adobe ColdFusion 11 to Lucee, a Case Study
desc: A collection of problems I ran into, and their solutions.
img: /img/2019/erda-estremera-sxNt9g77PE0-unsplash.jpg
date: 2019-09-18
tags:
  - cfml
  - coldfusion
  - lucee
  - retrospective
commentsPostId: from-coldfusion-to-lucee
---

![Moving Day: A small dog in a moving box](/img/2019/erda-estremera-sxNt9g77PE0-unsplash.jpg)

My team has made the decision to migrate our application from Adobe ColdFusion 11 ("ACF") to Lucee 5, and the time has come to pull the trigger. I spent a couple of days this week trying to get the app on its feet running on Lucee, and now that I seem to have solved all of the initial challenges, I thought I'd write about what problems I had and how I resolved them while it's still mostly fresh in my mind.

Plus I still have my git commits all neatly organized in a branch for easy reference.

I'm sure that this won't be an exhaustive list of every possible difference that you might encounter. Our app doesn't use every feature of the platform. But here's an account of what we had to deal with.

## ORM

By far, our biggest problem stemmed from how heavily this application uses the Hibernate ORM features in ACF. We have something like 160 distinct entities, with a lot of relationships between them.

### mappedSuperClass

To make matters worse, we _"architected"_ ourselves into a corner early on in the project by (sigh, we thought we were clever...) creating a parent object for every entity and using `mappedSuperClass` and inheritence to allow ourselves to customize certain entities for certain customers in certain scenarios. (ugh.)

I never ran into any problems that seemed to be caused by our usage of `mappedSuperClass`, but then again, ripping that out was one of the first things that I did. I got rid of all of the parent objects and inheritence. I guess it's fair to note that I've gotten mixed reports on `mappedSuperClass`. Some claim that it won't work with Lucee, and others say it's worked fine for them. It doesn't affect us, because we've wanted to get rid of it for a long time anyway, and now it's gone.

Similarly, I got mixed reports about using `lazy=true`/`lazy='extra'` on relationships. I left our lazy relationships in place and they seem to be working... for now.

### Error messages

The biggest problem debugging ORM issues is the error messages. They never seem to offer any useful hints; or they're at least _way_ too subtle.

Initially, after I had ripped out our usage of `mappedSuperClass` and deleted the parent objects, none of my entities had `persistent=true` set, so when the application attempted to load a user bean to put into the session, it reported this error:

> No entity (persistent component) with name [User] found, available entities are []

With the benefit of hindsight, the "persistent component" parenthetical does seem to be smacking me in the forehead, but at the time it was pretty baffling why it was saying that we didn't have any entities. We had many! Sort of.

---

![Entity Name [EventProductFee_PersonType] is ambiguous, [/Users/atcodes/DEV/AlumnIQ/com/alumniq/orm/ems/EventProductFee_PersonType.cfc] and [/Users/atcodes/DEV/AlumnIQ/com/alumniq/orm/ems/EventProductFee_PersonType.cfc] use the same entity name.](/img/2019/lucee-orm-error-sample.png)

_DUH_, right?

This one turned out to be that in Application.cfc, in `ormSettings.cfclocation` we had both the `orm/` folder, and the `orm/ems/` folders listed. While ACF managed to recognize that the same files were listed twice (because it was more than happy to recurse from `orm/`) and dedupe them, Lucee recursed but doesn't seem to be interested in deduplicating them and instead throws this error.

---

Next up was this lovely gem:

> entity [Person] with cfc name [orm.ems.Person] does not exist, existing entities are [foo,...]

This one turned out to be caused by relationship definitions. Some other entity had a relationship to Person and defined it as `cfc="orm.ems.Person"`, but Lucee didn't like that. For some reason it made me drop the `orm.` prefix.

### Strict in places ACF is not

Another early foible in our journey into the CF-ORM rabbit hole was cleverly thinking that we would group tables in the database by prefixing their table names, but not prefix the entity file name, as in:

**orm/ems/Activity.cfc:**

```
component
output="false"
persistent="true"
table="EMSActivity"
{
	...
}
```

Of course, ACF doesn't seem to care what's in the `table` attribute. It named our tables after the CFC file name, so in this case we got "Activity". At the time we ignored it. So our tables aren't grouped. Who cares?

It became a problem when switching to Lucee. I had to find all of the entities that attempted this approach and remove the prefix so that it would match the existing table.

## Different approaches to Java classes

Lucee 5 [doesn't currently support `this.javaSettings`](https://luceeserver.atlassian.net/browse/LDEV-2317) in Application.cfc, instead favoring an [OSGi approach](https://docs.lucee.org/guides/lucee-5/osgi.html).

So while this approach worked fine on ACF, for loading JARs for things like BCrypt and Redis:

```js
this.javasettings = {
	loadPaths = ["../lib"],
	loadColdFusionClassPath = true,
	reloadOnChange = false,
	watchInterval = 60,
	watchExtensions = "jar,class"
};
```

Those JARs and CLASSes aren't loaded by default in Lucee. Instead, you have to add a third argument to your `CreateObject()` calls:

```js
pool = CreateObject('java', 'redis.clients.jedis.JedisPool', expandPath('/lib'));
```

This wasn't too cumbersome to overcome. I searched (using regex) for `createObject\(\s?["']java`, which found all createObject calls that load java objects. Ignoring any that used baked-in system classes (like `java.lang.Thread`), and adding the 3rd argument for any that used libraries we're adding.

## EhCache isn't running by default

Using the methods `cacheGet`, `cachePut()` etc all depend on EhCache in ACF. In Lucee caches are not configured/running until you create them. I had to create a cache (choosing between RAM and EhCache) in admin, and then once it was created I could set it as the store for object caches.

## Syntax differences

### No support for for-in loops

For-in on arrays is handy. Oddly it seems like we only had one of these. I changed it from:

```js
var deletes = '';
for (var tbl in tables) {
	deletes &= 'drop table #tbl#; ';
}
```

to:

```js
var deletes = '';
tables.each(function (tbl) {
	deletes &= 'drop table #tbl#; ';
});
```

**Update:** Lucee _does_ support for-in loops on arrays. I'm not sure why that particular loop I ran into seemed to be troublesome, but it certainly was at the time. Probably. I think. But as you can see in the example below, it definitely works. 🤷🏻‍♂️

<iframe style="width: 100%; height: 250px;" src="https://trycf.com/gist/da195986b3333a006376aa2165b1b203/lucee5?theme=monokai"></iframe>

### Canonicalize

It's [reasonably well documented](https://cfdocs.org/canonicalize) that ACF's final argument to `canonicalize()`, `throwOnError` [isn't supported by Lucee](https://luceeserver.atlassian.net/browse/LDEV-2391). It's still an open question for me to figure out how this affects our app (because we had it set to true), but for now I've simply deleted the argument.

### Colons in function meta-attribute names

Our app uses FW/1, and I built a role-based security system on top of it. It would require an authenticated session to access controller methods in a cfc with `iq:auth=true` on the component or on the method in question, and then additionally enforce role restrictions on a per-method basis. Each method could have a metadata attribute named `iq:role` attached, where a list of roles that would grant you access could be supplied (`iq:role="foo,bar,baz"`). If you have any one of the roles, you're allowed to proceed.

Alas, Lucee chokes on the colons. I [went through this with Taffy](http://docs.taffy.io/3.2.0#taffydashboardhide), too. I guess I just really like the colons. They remind me of writing ActionScript.

It was easy enough to search/replace to `iq_auth` and `iq_role`.

### CFLocation Script syntax difference

The cfscript version of the `<cflocation>` tag is slightly different on Lucee than on ACF. I found the [cfscript docs by Adam Cameron](https://github.com/adamcameron/cfscript/blob/master/cfscript.md) helpful in sorting this out.

## Overall Advice

In general, be prepared for a lot of confusion and carefully binary-searching your code to find the offending blocks of code:

When you're getting an error for/in one file, comment out the entire file (leaving something otherwise functional, so if it's a CFC comment out everything inside the `{}` brackets). If the error message _changes_ (or goes away completely) then clearly there's a problem in your commented code. Uncomment about half of it. Did the previous error come back? It's somewhere in that half. If not, then the now-uncommented portion is either fine, or is the source of the 2nd error message. Mark it as "safe" (I used a lot of comments like "everything is fine above this line") and then repeat the process with half of the code that remains commented.

Eventually you should narrow it down to one line or a small chunk of lines. That should hopefully give you some idea of what to look for, and when all else fails ask about it in the CFML Slack. There's a Lucee chat room, and the folks there are always very helpful.

Speaking of which, I need to thank (in the order that they first offered me advice on this journey) Brad Wood, Matthew Clemente, Pete Freitag, and Samuel Knowlton from the #Lucee chat for your help. Thanks, gents!

I imagine I'm not done troubleshooting differences between ACF and Lucee yet, but my app is on its feet.

## Update: They keep helping me

I've now also been informed that Lucee supports defining caches in Application.cfc, as seen here:

https://twitter.com/michaelborn_me/status/1171405720987811841
