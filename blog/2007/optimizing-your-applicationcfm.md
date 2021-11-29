---
title: Optimizing your Application.cfm
description: In his 2007 debut tech-blog post, Adam Tuttle explains how to efficiently bootstrap a CFML application.
date: 2007-04-27
tags:
  - best practices
---

Because Application.cfm is called on every request, it is extremely important that it be succinct, efficient, and optimized. Besides containing hundreds of lines of code, the worst and most common faux-pas I've seen among my clients is setting all of your application variables on every request.

Global availability within your application and the fact that they are stored in memory long term are the two greatest advantages to using application variables, and if you are resetting their values on every request you've eliminated half of those. You should instead check for the existence of your application variables and, if not found, reset them.

In short, this is bad code:

```xml
<cfapplication name="myApp">
<cflock scope="application" type="exclusive" timeout="30">
	<cfset application.myvar="25">
</cflock>
```

And this is good code:

```xml
<cfapplication name="myApp">
<cfif not isDefined("application.varsAreSet")>
	<cflock scope="application" type="exclusive" timeout="30">
		<cfset application.myVar=25>
		<cfset application.varsAreSet="true">
	</cflock>
</cfif>
```

I am planning on posting additional Application.cfm optimization techniques next week - focusing on how best to make a single application.cfm that works in all of your environments, and as always, welcome questions.
