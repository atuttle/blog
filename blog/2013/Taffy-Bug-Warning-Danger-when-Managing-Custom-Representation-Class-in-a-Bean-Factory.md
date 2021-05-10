---
title: "Taffy Bug Warning: Danger when Managing Custom Representation Class in a Bean Factory"
summary: "Taffy Bug Warning: Danger when Managing Custom Rep..."
date: 2013-07-30 08:35:33
tags:
  - taffy
commentsPostId: Taffy-Bug-Warning-Danger-when-Managing-Custom-Representation-Class-in-a-Bean-Factory
---

Just a quick note to let anyone out there using Taffy in a certain way know that I found [a pretty severe bug](https://github.com/atuttle/Taffy/issues/147) last night.

 * If you're not using a [Custom Representation Class](https://github.com/atuttle/Taffy/wiki/Using-a-Custom-Representation-Class) ("CRC"), this bug does not affect you.
 * If you're not storing said CRC in a Bean Factory, this bug does not apply to you.
    * To do this, you would either put your CRC somewhere inside your `/resources` folder, or define it in your bean factory config (e.g. coldspring.xml)

I have yet to test this using ColdSpring, but the gist of the problem is that instead of using a clean copy of the representation class for every request, the same one is used over and over again (only when using the above-described configuration). This results in race conditions, and even with 100% sequential requests, could result in response data, status code/text, and headers from one response bleeding into later responses.

There are two known workarounds right now. Implementing either one by itself should completely mitigate the problem:

 * Don't store your CRC inside of a Bean Factory; not even Taffy's `/resources` folder.

<del>or...</del>

<ul>
<li><del>For every response, in every resource, make sure you explicitly define all output:</del>
<ul>
<li><del>Data (It's possible that the `noData()` method is affected, I haven't tested this either...</del></li>
<li><del>Status Code</del></li>
<li><del>Status Text</del></li>
<li><del>Additional Headers (if you don't need to add extra headers, pass <code>{'{}'}</code>)</del></li>
</ul></li></ul>

<del>Obviously the former approach should be easier to implement on larger API's.</del>

> After further consideration, the second workaround proposed above is not a good idea. If a race condition occurs, responses could still bleed into one another.

For a little bit more information and status updates as I work on the resolution, keep an eye on [this bug report](https://github.com/atuttle/Taffy/issues/147). The fix will go into the Bleeding Edge release soon. Both the 1.3 and 1.2 branches will be updated soon thereafter, so if you're still on a supported version of Taffy you can expect fixes!

Apologies for the bug. If it softens the blow any, I found it while working on a project fast approaching its deadline, so it has pretty greatly inconvenienced me, too!

I'll post here on my blog once the updated versions are available for download.
