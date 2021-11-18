---
title: "Taffy 3.3 release: What's inside?"
desc: "After almost 4 years stable at version 3.2, there's a new version of Taffy available!"
img: /img/2021/mesha-mittanasala-_Y94hdK73tk-unsplash.jpg
date: 2021-08-24
tags:
  - taffy
  - open source
---

Taffy 3.2.0 was an extremely stable release, as evidenced by the fact that it was published on November 10th 2017 (nearly 4 years ago!) and that was the last release until today.

<p style="text-align: center"><a href="https://github.com/atuttle/Taffy/releases/tag/v3.3.0" class="btn">Taffy 3.3.0 is out now! Download it here!</a></p>

![Screen shot of Taffy 3.3.0 improvements to the inline documentation in the dashboard](/img/2021/taffy-330-improved-docs.png)

To be fair, much of what's new in Taffy 3.3.0 has been there for a while. I was mostly just too busy or too lazy to create an official release for it. But some new features that I've added in recent weeks definitely deserve some attention and a new version number. As (almost) always, you can check the release notes for [all details of what's new in Taffy 3.3.0](https://docs.taffy.io/#/3.3.0?id=what39s-new-in-330), but here are some highlights:

- No breaking changes! 🎉 Since Taffy obeys [SemVer 2.0.0](http://semver.org/) versioning rules, any breaking changes will result in the major version number increasing (e.g. 4.x.x). Thus, you should be able to upgrade from any 3.x.x version with high confidence that nothing will break!
- Instantly find the resource you're looking for with a search-as-you-type filter at the top of the dashboard. Thanks to [James Moberg](https://github.com/JamoCA)!
- "Bare" returns from resources are now supported. You can skip the `return rep(data);` and just use `return data;` as long as you don't need any of the chaining methods (like `.withStatus()`). Pro-tip: you can use [queryToArray()](https://docs.taffy.io/#/3.3.0?id=querytoarray) without `rep()`! Thanks to [y2kiah](https://github.com/y2kiah) for the idea!
- The dashboard and documentation for your Taffy API's got a nice sprucing up:
  - Larger text and increased contrast: better accessibility! 👍
  - Added a tabbed UI inside each resource's panel to separate the inline docs from the interactive runner. The docs always felt too squished over on the side before!
  - Added support for displaying sample return data for each method (more on this below).
  - With the addition of the sample responses, docs can get really long really fast, so I've added a small accordion to each method to collapse the documentation for its inputs and sample response (if any).

### Sample responses, you say?

Yup! Have you ever tried to onboard a new API consumer and wanted to give them a way to interact with the API to verify they're calling it correctly, but either don't have real data for them yet or don't want them testing against it? Enter **sample responses** and **simulated requests**.

You specify the sample response for your GET method by adding a `sampleGetResponse` method that returns the raw data of your sample response. It doesn't receive any input arguments.

```js
function sampleGetResponse() {
	return [
		{
			indentationMethod: 'tabs',
			rating: 'superior'
		},
		{
			indentationMethod: 'spaces',
			rating: 'inferior'
		}
	];
}
```

Your sample responses will automatically be displayed in a nice little collapsable drawer in the dashboard and docs pages.

If a simulated request is made, the sample response data is returned rather than running the request normally. If there is no applicable sample response method, the simulated request returns status 400.

By default simulated requests are made by adding `?sampleResponse=true` to your request (or e.g. `{"sampleResponse":true}` in a POST body...). You can override both the key and the password using the new [simulateKey](https://docs.taffy.io/#/3.3.0?id=simulatekey) and [simulatePassword](https://docs.taffy.io/#/3.3.0?id=simulatepassword) configuration attributes.

Of course there's [much more that's new and improved](https://docs.taffy.io/#/3.3.0?id=what39s-new-in-330), but those are the highlights. Enjoy!
