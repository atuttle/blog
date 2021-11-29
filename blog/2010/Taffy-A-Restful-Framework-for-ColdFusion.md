---
title: 'Taffy: A Restful Framework for ColdFusion'
summary: 'Taffy: A Restful Framework for ColdFusion...'
date: 2010-08-23 11:00:13
tags:
  - taffy
---

> **Update:** Since this was posted in August of 2010, a lot has changed with Taffy. We're now approaching a 1.2 release, and new development should not be done against 1.0. [See this page for more information](http://atuttle.github.com/Taffy/).

Today I'm excited to announce something that I've been working on quietly for a few months. I've created a framework for the purpose of building Restful APIs with semantically correct URIs -- no easy task in vanilla CFML -- simply and elegantly. I call it [Taffy](http://taffy.riaforge.org/).

I've taken some inspiration from [FW/1](http://fw1.riaforge.org/), [Powernap](http://powernap.riaforge.org/), and [Swiz](http://swizframework.org/). Much like FW/1, Taffy is a set of base classes that your Application.cfc and resource CFCs extend; and similar to Powernap, Taffy uses the notion of "representation" classes. Don't worry about these yet - it's easy and I'll get into them in more detail later. Lastly, using Swiz taught me the power of metadata, so I made it a big part of Taffy.

As much as is possible, Taffy uses convention instead of configuration. There's no messy mapping of _**this** http verb used with **this** URI calls **this** function in **this** cfc_. You set a few bits of metadata and use a few pre-determined function names, and everything falls into place.

Enough blabber, let's look at a REST API written with Taffy!

## Setting up the framework

**Application.cfc**

```js
component extends="taffy.core.api" {
	this.name = hash(getCurrentTemplatePath());
}
```

Simple enough for you? In case you missed it, this is a generic application with a unique name... and it uses the component **extends** attribute to extend Application.cfc from Taffy's core api class.

The only requirement is that you either put Taffy in your web root, or create a CF mapping to it.

Ok, so there are _a few_ configuration options, all of which you set in Application.cfc, as in the next code sample. I'm going to show all of the configuration options, but use their default values.

```js
component extends="taffy.core.api" {

	this.name = hash(getCurrentTemplatePath());

	//use this instead of onApplicationStart()
	void function applicationStartEvent(){}

	void function configureTaffy(){
		//these are all default values, but if you want to change them this is the place:
		setDebugKey("debug");
		setReloadKey("reload");
		setReloadPassword("true");
		setDashboardKey("dashboard");
		setDefaultRepresentationClass("taffy.core.genericRepresentation");
		registerMimeType("json", "application/json");
		setDefaultMime("json");
	}
}
```

Still pretty simple, right? And now you have an application capable of servicing REST requests. You just don't have any resources.

## Resources

In general with REST, there are two types of resources: Collections and Members. Think of Collections as a query object that shows the entire contents of the table, and Members as a structure representing a single row of the same query. With Taffy, you implement Collections and Members as separate CFCs.

Let's start with a Collection, using the trusty old Art Gallery datasource:

**artistCollection.cfc**

```xml
<cfcomponent extends="taffy.core.resource" taffy_uri="/artists">

	<cffunction name="get" access="public" output="false">
		<cfset var q = "" />
		<cfquery name="q" datasource="cfartgallery" cachedwithin="#createTimeSpan(0,0,0,1)#">
			select * from artists
		</cfquery>
		<cfreturn representationOf(q).withStatus(200) />
	</cffunction>

	<cffunction name="post" access="public" output="false">
		<cfargument name="firstname" type="string" required="false" default="" />
		<cfargument name="lastname" type="string" required="false" default="" />
		<cfargument name="address" type="string" required="false" default="" />
		<cfargument name="city" type="string" required="false" default="" />
		<cfargument name="state" type="string" required="false" default="" />
		<cfargument name="postalcode" type="string" required="false" default="" />
		<cfargument name="email" type="string" required="false" default="" />
		<cfargument name="phone" type="string" required="false" default="" />
		<cfargument name="fax" type="string" required="false" default="" />
		<cfargument name="thepassword" type="string" required="false" default="" />
		<cfset var q = "" />
		<cfquery name="q" datasource="cfartgallery">
			insert into artists (firstname,lastname,address,city,state,postalcode,email,phone,fax,thepassword)
			values (
				<cfqueryparam cfsqltype="cf_sql_varchar" value="#arguments.firstname#" />,
				<cfqueryparam cfsqltype="cf_sql_varchar" value="#arguments.lastname#" />,
				<cfqueryparam cfsqltype="cf_sql_varchar" value="#arguments.address#" />,
				<cfqueryparam cfsqltype="cf_sql_varchar" value="#arguments.city#" />,
				<cfqueryparam cfsqltype="cf_sql_varchar" value="#arguments.state#" />,
				<cfqueryparam cfsqltype="cf_sql_varchar" value="#arguments.postalcode#" />,
				<cfqueryparam cfsqltype="cf_sql_varchar" value="#arguments.email#" />,
				<cfqueryparam cfsqltype="cf_sql_varchar" value="#arguments.phone#" />,
				<cfqueryparam cfsqltype="cf_sql_varchar" value="#arguments.fax#" />,
				<cfqueryparam cfsqltype="cf_sql_varchar" value="#arguments.thepassword#" />
			)
		</cfquery>
		<cfquery name="q" datasource="cfartgallery">
			select * from artists
			where
				firstname = <cfqueryparam cfsqltype="cf_sql_varchar" value="#arguments.firstname#" />
				and lastname = <cfqueryparam cfsqltype="cf_sql_varchar" value="#arguments.lastname#" />
				and address = <cfqueryparam cfsqltype="cf_sql_varchar" value="#arguments.address#" />
				and city = <cfqueryparam cfsqltype="cf_sql_varchar" value="#arguments.city#" />
				and state = <cfqueryparam cfsqltype="cf_sql_varchar" value="#arguments.state#" />
				and postalcode = <cfqueryparam cfsqltype="cf_sql_varchar" value="#arguments.postalcode#" />
				and email = <cfqueryparam cfsqltype="cf_sql_varchar" value="#arguments.email#" />
				and phone = <cfqueryparam cfsqltype="cf_sql_varchar" value="#arguments.phone#" />
				and fax = <cfqueryparam cfsqltype="cf_sql_varchar" value="#arguments.fax#" />
				and thepassword = <cfqueryparam cfsqltype="cf_sql_varchar" value="#arguments.thepassword#" />
		</cfquery>
		<cfreturn representationOf(q).withStatus(200) />
	</cffunction>

</cfcomponent>
```

There are quite a few lines of code there, but most of them are querying the database. If we ignore those lines, we go down from about 55 lines to about 21. Let's break down the important stuff:

1.  The component extends **taffy.core.resource**. This is where it inherits functionality like the **representationOf** and **withStatus** functions.<br/><br/>
2.  The component also has a metadata attribute named **taffy_uri** that tells Taffy the URI of the _collection_ that we are defining. We'll talk more about URIs and how you can use them in the next section.<br/><br/>
3.  Functions defined here are named GET and POST. For the sake of discussion, I refer to these as Responders. Notice that these correspond to HTTP verb names (get, put, post, delete). I bet you can guess the convention. That's right, when the GET verb is used, the GET function will be called. <br/><br/>
4.  All responders must return using the function **representationOf**. This returns a special class containing your data that can be serialized into multiple formats. A JSON serializing representation class comes with the framework, but you can also create and use a custom representation class capable of serializing to any format you want (for example: XML, YAML, WDDX, HTML, etc). I will cover using a custom representation class in a later post, and may decide to create examples that serialize to various formats.<br/><br/>
5.  Notice that responders are not present for all 4 HTTP verbs. If a request is made and no responder exists corresponding to the request verb, Taffy will respond with HTTP status **405 Not Allowed**.

## URIs and making them work for you

You know what a URI is, right? It's a neat (as in tidy) little chunk of URL that tells the web server _exactly_ what bit of data you're interested in. For example, here's a URI for a recent tweet of mine on twitter:

```
/AdamTuttle/status/21767382574
```

When sent to Twitter.com, they reply with [just that one tweet](http://twitter.com/AdamTuttle/status/21767382574). In actuality, your browser is making a GET request to Twitter's API, which is responding with some HTML. Likewise, using the URI `/AdamTuttle` you'll get an HTML response of the entire _collection_ of my tweets (paged).

Taffy makes doing this with ColdFusion simple and powerful. This is where that component metadata comes into play. By setting the **taffy_uri** of `/artists`, Taffy knows to connect requests for the `/artists` collection up to our artistCollection CFC.

That's great for collections, but if you're thinking ahead then you've no doubt wondered how we're going to handle unique bits in the URI. Given the same Twitter-based example, we can't handle every permutation of unique tweet ID's in the metadata individually. For one, it's not possible, and even if it were, it's just not a reasonable approach. That's where tokens come in.

This is a perfectly valid **taffy_uri**: `/artists/{artistId}` -- and in fact, that is the **taffy_uri** of the artistMember CFC.

If we were writing the Twitter API and the tweet member CFC, it might start out like this:

```js
component
	extends="taffy.core.resource"
	taffy_uri="/{username}/status/{tweetId}" {
```

When Taffy starts up, it inspects all of your Resource CFCs, grabbing that metadata, and converting the **taffy_uri** to a regular expression used to match incoming requests. All that you need to know is that if your URI defines a token `{foo}` then it will be passed by name to your responders -- so you have to have an argument named the same as your token, in this case, "foo".

There is one caveat with tokenized URIs. Stripped of all tokens, they must all be unique. If you define two Resources with the URIs `/foo/{bar}` and `/foo/{fubar}` then there is no way for Taffy to tell which is the appropriate CFC to use for the request. To Taffy, they both look like this: `/foo/{some_token}`, so having two of them is not unique, and Taffy will throw an exception during startup.

## Providing Resources to Taffy

There are three methods for getting Resources into Taffy.

- Taffy will automatically load your Resource CFCs from a child folder of the API root named "resources". If you are using ColdFusion 6, 7, or 8, you will need another CF mapping named "/resources" which points to your resources folder, and in CF8, of course, you can use an application-specific mapping. In CF9 (and presumably later) no "/resources" mapping is necessary. This is due to a difference in the way that CFC paths are evaluated when used from a parent CFC, which I plan to write about in a later post.

Taffy will also work with an external bean factory, like ColdSpring, in two ways.

- First, you can use it to manage your resources _instead of_ putting them into a child folder named "resources". If you choose to do this, there is no need to notify Taffy about each resource in any way; you simply set the bean factory and Taffy will request any beans that extend the taffy.core.resource base class. If you choose to go this route, you can simply manage any dependencies of your resources -- e.g. the service objects they might use to access the database -- in your bean factory configuration.

- Alternately, you can use the convention folder ("resources") _and_ an external bean factory, which will be used to resolve dependencies. This works similarly to ColdSpring -- if your Resource CFC contains a method named "setFoo" and your bean factory has a bean named "foo", then the "foo" bean will be set into the Resource when it is instantiated and cached.

In both cases, you can set your Taffy API up to be a child-application of a larger application that already uses a bean factory. By doing so, you don't have to duplicate your bean factory configuration, and Taffy will use the same existing factory instance.

## Download

I suppose that's enough information to get you started. The download comes with several examples: an API implemented using no external bean factory, one using _only_ ColdSpring, and one using _both_ the internal resource factory and ColdSpring. It also has a consumer application that you can point at any of the three example APIs.

There are a few other things that I decided to leave out here for the sake of brevity (ha!), but everything should be pretty well documented in the wiki: [http://github.com/atuttle/Taffy/wiki](http://github.com/atuttle/Taffy/wiki). If you have any questions, just ask!

The project is listed on RIAForge: [http://taffy.riaforge.org](http://taffy.riaforge.org/), and the source is hosted on Github: [http://github.com/atuttle/Taffy](http://github.com/atuttle/Taffy).

You can download as:

<a href="https://github.com/atuttle/Taffy/zipball/master"><img alt="Download as ZIP" src="https://github.com/images/modules/download/zip.png" /></a>
<a href="https://github.com/atuttle/Taffy/tarball/master"><img alt="Download as TAR" src="https://github.com/images/modules/download/tar.png" /></a>
