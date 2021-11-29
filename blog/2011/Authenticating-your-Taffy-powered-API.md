---
title: 'Authenticating your Taffy-powered API'
summary: 'Authenticating your Taffy-powered API...'
date: 2011-10-01 14:35:54
tags:
  - taffy
  - rest
---

Authentication is an important problem, and usually one of the first questions I get when I'm telling people about Taffy. My canned response is that Taffy does not handle any authentication for you, but it does expose some functionality for you to build authentication into your APIs.

I cover the topic a little bit in [the presentations I've given on Taffy](../My-cfObjective-2011-Slides-Notes/), but essentially the message is the same.

The reason that Taffy doesn't handle authentication is because there are probably a dozen or more ways you could accomplish it (OpenID, OAuth1, OAuth2, HTTP Basic, and the list goes on...), and no one way would satisfy everyone. Trying to add multiple methods into the framework would add a lot of bulk that would be wasted by anyone not using that functionality.

To help you add authentication, Taffy calls a method in Application.cfc named **onTaffyRequest**, passing in all of the details of the request (verb, headers, arguments, etc) after it has parsed them from the request, but before running any of _your_ code. This allows you to inspect the request and decide whether or not you want to allow it to continue, or redirect, or return an error or... whatever else you might want to do.

That said, people have done a few different things, and I thought it would be useful to share them with you.

Greg Mosier, who is writing an eCommerce plugin for Mura called Slatwall, posted about [his solution for authentication](http://www.gregmoser.com/blog/ajax-authentication-with-taffy-rest-api/), which denies requests that didn't originate from a user with an existing authenticated ColdFusion session.

Then, Glynn Jackson [posted about his solution](http://www.cfcoffee.co.uk/index.cfm/2011/9/22/API-Authentication-with-Taffy) which uses public and private keys (kind of like SSH, but not exactly the same) to prevent unauthorized database changes. As discussed in the comments on his post, since he's not using SSL, the data is not secured in-transit; his authentication is only serving to prevent unauthorized reads and writes against his database. Anyone sniffing traffic in the middle would be able to see what the data was. Still a perfectly valid approach though, depending on your requirements.

Of course there are a lot more ways to accomplish authentication, but hopefully these examples will get you started and help you understand how **onTaffyRequest** works.
