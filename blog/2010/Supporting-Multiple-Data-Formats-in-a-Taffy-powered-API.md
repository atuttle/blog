---
title: "Supporting Multiple Data Formats in a Taffy-powered API"
summary: "Supporting Multiple Data Formats in a Taffy-powere..."
date: 2010-10-14 08:00:21
tags:
  - taffy
commentsPostId: Supporting-Multiple-Data-Formats-in-a-Taffy-powered-API
---

>**Note:** The code used in this example post will be based on the upcoming release of Taffy 1.1. The differences are minor, and the public builds available on Github should always be stable (unless a bug sneaks by me), so I would encourage you to upgrade. I will point out the differences as I go, for those that don't want to use interim builds. Even though 1.1 is not officially released yet, you can make use of changes like those seen here by downloading [the latest build from Github](http://github.com/atuttle/Taffy). (And you need not know anything about Git to do so, it's almost the same as downloading a project from RIAForge...)

One of the first questions people seem to have about Taffy is about supporting multiple return formats. While this is still fairly simple to do -- once you know how, I guess -- it is probably one of the more complex things to do with Taffy. This post shows example code for supporting both XML and JSON data formats ("mime types") from a single API.

The first thing that you need to understand is that the **Representation Class** is a single component that can handle _all_ of the data formats that your API supports. So if your API needs to support JSON and XML, as this example will, then the component needs to be able to handle both formats.

Here is our example custom representation component, which I've named **CustomRepresentationClass.cfc**, and put into my resources folder:

```xml
<cfcomponent extends="taffy.core.baseRepresentation">

	<cfset variables.JSONUtil = application.JSONUtil />
	<cfset variables.AnythingToXML = application.AnythingToXML />

	<cffunction
		name="getAsJSON"
		taffy:mime="application/json"
		taffy:default="true"
		output="false">
			<cfreturn variables.JSONUtil.serializeJson(variables.data) />
	</cffunction>

	<cffunction
		name="getAsXML"
		taffy:mime="application/xml"
		output="false">
			<cfreturn variables.AnythingToXML.ToXML(variables.data) />
	</cffunction>

</cfcomponent>
```

There are a few things of note that have changed for 1.1:

* The component extends `taffy.core.baseRepresentation`, not `taffy.core.genericRepresentation`. The `genericRepresentation` class is still available for backward compatibility, but future code should use `baseRepresentation`.

* The `taffy_mime` and `taffy_default` metadata attributes of the function tags have been replaced by `taffy:mime` and `taffy:default` respectively. The old names are still supported, though deprecated.

And here are the other things that are important about the above code:

* Both "getAsJSON" and "getAsXML" functions are implemented; which tells Taffy that both of these formats are supported by your API, and it will allow ".json" and ".xml" extensions to be used in the URI.

* The libraries used, [JSONUtil](http://jsonutil.riaforge.org) and [AnythingToXML](http://anythingtoxml.riaforge.org), are not instantiated by this component; they are stored (cached) in the Application scope and referenced by this component. This is for optimal performance.

There are two other parts to this puzzle: Putting the libraries in the right location, and caching them in the Application scope for your custom representation class to use.

There is no "right" place to put the libraries, but I like to put them into the resources folder. For the sake of cleanliness, I like to put an AnythingToXML folder inside the resources folder and put the AnythingToXML components inside that folder, because there are a few of them. In the case of JSONUtil, which is only a single component, you could just put the component directly into the resources folder; but for consistency, I create a JSONUtil folder and put the JSONUtil component inside it. Now, our example API folder structure resembles this:

![Folder structure for supporting multiple mime types](/images/taffy-multimime-libs.png)

All that's left to do is cache the libraries in Application scope. My example Application.cfc is:

```xml
<cfcomponent extends="taffy.core.api">

	<cfscript>
		this.name = hash(getCurrentTemplatePath());

		function applicationStartEvent(){
			application.JsonUtil = createObject("component", "resources.JSONUtil.JSONUtil");
			application.AnythingToXML = createObject("component", "resources.AnythingToXML.AnythingToXML");
		}

		function configureTaffy(){
			setDefaultRepresentationClass("resources.CustomRepresentationClass");
		}
	</cfscript>

</cfcomponent>
```

In the `applicationStartEvent` method, we create and cache the library objects in the application scope, and in the `configureTaffy` method, we set the default representation class to be our custom class instead of the framework default.

That's it. Your API will now respond to requests for foo.json with a JSON representation of foo, and foo.xml with an XML representation of foo.

I hope to officially release Taffy 1.1 by early November.
