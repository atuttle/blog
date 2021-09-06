---
title: "Taffy 1.3 beta1"
summary: "Taffy 1.3 beta1..."
date: 2013-02-01 09:38:26
tags:
  - taffy
commentsPostId: Taffy-1-3-beta1
---

I know it hasn't been long since Taffy 1.2 was [finalized](/blog/2012/Taffy-1-2-Codename-Halfling/), but as promised I'm operating with a much shorter release cycle. Taffy 1.3 beta1 is here now, and barring any issues, I expect to finalize it in late February or early March.

<a href="https://github.com/atuttle/Taffy/archive/1.3.0-beta1.zip" class="btn btn-warning">Download current beta: 1.3.0 beta 1</a>
<a href="https://github.com/atuttle/Taffy/archive/v1.2.0-Halfling.zip" class="btn btn-info">Download latest stable release: 1.2.0</a>

You can find the release notes for this and previous releases [on the wiki](https://github.com/atuttle/Taffy/wiki/Releases). Some of the highlights include:

 * A message is now displayed if Taffy can't find any resources:<br/>![](https://www.evernote.com/shard/s240/sh/6b166322-d8a8-4209-8de1-7348abd8baca/3b4072548cd291ded70ae60f1d4d5583/res/1539c94d-d644-48cc-883a-cfb80e37c4e5/skitch.png)
 * The dashboard will now be at the root of your api (so: `http://api.foo.com/` instead of `http://api.foo.com/?dashboard`), and the `?dashboard` query parameter is deprecated.
   * If you've disabled the dashboard, Taffy will respond **403 Forbidden**. If you disable the dashboard _and_ set `variables.framework.disabledDashboardRedirect = 'http://google.com';` then the user will be redirected to `http://google.com` instead of receiving **403 Forbidden**.
 * Added support for DI/1
 * Environment-based configuration (separate settings for dev, qa, prod, etc)
 * Added helpers for Basic Auth
 * [ETags](http://en.wikipedia.org/wiki/HTTP_ETag) for caching can now be enabled with a single boolean configuration option -- no other code necessary.
 * For anyone who didn't like the `/index.cfm/URI` approach, we now support `/index.cfm?endpoint=/URI` (and the query param name "endpoint" is configurable).

> **Note:** Until now, all development has been done in a next-version branch and only merged into master at release. Starting with the development of version 1.4, all new development will be done in the master branch, making it easier for people to use the Bleeding Edge Release (BER), and easier for people to submit pull requests. I will make sure that the GitHub page has links to download both the BER and the latest stable version.
