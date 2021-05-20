---
title: 'Publishing Flag Changes with Semaphore'
date: 2021-05-20
tags:
  - semaphore
  - open source
commentsPostId: publishing-flag-changes-with-semaphore
---

In [yesterday's announcement][announce] about the release of [Semaphore][github], I wrote a little bit about how I'll be wrapping Semaphore with a service which makes it easy to evaluate flags anywhere in my application, but one thing I didn't describe was my plan for publishing new/updated flags to each application instance as they change. So let's do that.

One of the primary benefits of feature flags is the ability to decouple deploy from release, and in order to accomplish that decoupling you need to have a mechanism for updating the local flag state cache. You could set up a scheduled task to poll your persistence layer for any updates, but the frequency with which I expect flags to be updated (pretty low, maybe a few times per day) is at odds with the speed at which I want my flag changes to be running in production. No, a push mechanism is definitely needed.

In the off-the-shelf projects like LaunchDarkly, the impression that I get is that their SDK creates an in-memory cache that loads at app start and that they can push changes into when you make them from their admin interface. I want something like that.

There's not much to it, really. The flag data gets updated in persistence (Redis, in my case), and then I'll notify each server to fetch the latest flags on-demand. This way I don't have to have dozens of servers all DDoSing my Redis cluster every 15 seconds to check for flag updates, but also my changes will deploy ~immediately. Best of both worlds.

My service has a method for updating the local flag cache:

```js
public void function updateFeatureFlagCache(){
	var flags = redisService.get('feature-flags');
	semaphore.setAllFlags( flags );
}
```

Plop this behind a publicly-addressable but moderately-secret URL and you've got a realtime-ish publish mechanism for flag changes without an application deploy. Whatever interface you use to manage your flags should loop over the list of applicable servers and notify them each to update their cache any time a flag is updated.

That's it. It's really that simple. Even I thought there might be more to explore here, but nope.

[announce]: https://adamtuttle.codes/blog/2021/introducing-semaphore/
[github]: https://github.com/atuttle/semaphore
