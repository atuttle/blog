---
title: A Bunch of Meta Changes for This Website That Probably Nobody Cares About
desc: A bunch of stuff on my website has changed, and nobody will care, so I'll talk to myself about it.
date: 2021-11-19
img: /img/2021/ian-schneider-TamMbr4okv4-unsplash.jpg
tags:
  - meta
---

![](/img/2021/ian-schneider-TamMbr4okv4-unsplash.jpg)

Photo by <a href="https://unsplash.com/@goian?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Ian Schneider</a> on <a href="https://unsplash.com/s/photos/change?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>{class="photo-byline"}

Frequent visitors to this website (so, me) might notice that there are some differences around here. That's because I've spent a bunch of little bits of free time over the last few months working on a bit of a redesign. If for no other reason than to mark the occasion, I thought I would discuss the changes here.

### Dark Mode!

I have been slowly converting my entire life over to full-time darkmode, and I gotta say, it's nice. I think it's harder to make text clean and legible on a dark background than it is on a light background, but it can be done. Hopefully I've succeeded. Plus it was a fun little challenge to learn something new in CSS.

If you toggle your system dark mode setting with this website open, the colors are responsive to the change. You're welcome?

### Still on Eleventy (for now)

As with the previous iteration, my blog (still) runs on [Eleventy][eleventy]. And this was exactly where I wanted to be... until a week ago, when I dove into the [Svelte][svelte] deep end. It hurts when you're nearly done with a rewrite and realize you want to start from scratch again, but well, here we are.

I did poke at it for one evening and I think it'll be a fun project, but it wasn't easy enough to get off the ground (with the customizations I'll need) to skip the updated Eleventy version, so I'll stick with what I've got for now and maybe run Svelte later.

### Now a Digital Garden, No Longer a Blog

I don't know that most of you will notice anything different for this one. The TL;DR is that a [digital garden][] is intended to be pruned and maintained over time, where a blog is kind of an append-only log. Its information isn't necessarily organized in a chronological way. Check out [the new home page](/) to see what I mean by this. Thinking about it this way makes me feel freer to go back and delete or change older entries if/when I deem fit; though I don't know how much I'll actually do that.

For SEO reasons I'm keeping the `/blog` in the URL (easier than fighting redirects and hoping for the best).

### So Long Disqus, Hello Webmentions

This is probably the most impactful of all of the changes. I've been blogging for a long dagum time. Long enough to remember when getting to Google Reader Zero every day was just as important, if not more important than, getting to Inbox Zero (for some of us). Back in those days, before there was Twitter... heck, before there was Facebook, commenting on blogs was _so_ much more common. I think Twitter and Facebook killed blog comments; at least in the communities I frequent.

I'm not going to show you my Disqus stats from the last couple of years, because nobody likes having spiderwebs shoved into their eyeballs. I had ONE post in the last year that garnered more than a single comment, and while there were a couple of single-comment posts, they were outnumbered by no-comments posts by at least 5:1.

And that's fine. The web evolves. That's kind of the only thing it does. Discussions happen vigorously and rapidly on Twitter. Might as well take the discussion to where the people are already talking, right?

I know that some corporate firewalls block Disqus for some reason. Also, I think there are a lot of people that view Disqus as privacy-invading and so they block it or ignore it. That's fair.

Enter [Webmentions][]. Old-school bloggers may be familiar with the idea of "pingbacks" and Webmentions are sort of a reimagining of that. The short version is that if I tweet a link to a post here, and you reply, your reply will show up as a comment. Also, if you like the tweet it'll show up here as a like. Retweets too, though I've not seen what those look like yet.

I was first exposed to Webmentions by [swyx's post on doing it all client-side][swyx]. I did some initial research at the time but couldn't wrap my head around it. I filed it away to come back to later, and earlier this week I heard about it on a podcast, found [a good guide for my stack][guide] (Eleventy, GitHub Actions, and Netlify), and was able to put it together.

I have a reasonably good idea that my posts were getting _some_ engagement on Twitter that wasn't reflected in the old comments, so hopefully this makes it easier to participate, which should hopefully encourage some participation.

To the best of my understanding, webmentions are scraped from Twitter every 30 minutes or so, and I'm running builds of my site on a schedule every half hour now, which should mean that your likes/comments/etc would show up within an hour at the latest. If my math is correct.

### Contributions Welcome

At the bottom of most pages you'll find links to edit them directly on GitHub. I welcome anyone and everyone to [submit pull requests](https://github.com/atuttle/blog/). If you're making simple text changes like fixing a typo then I find editing directly on GitHub instead of cloning to local to be a perfectly suitable approach, and they make submitting the PR really easy. I intend to add [all-contributors-bot][] to the blog repo, because I want to be transparent about my gratitude for your help.

And if you've never made a pull request before, a copy edit to a blog post is a great way to get your feet wet!

### Fín.

That's all for now. If you see anything broken or otherwise messed up, please either let me know or if you're feeling generous and kind you could always [submit a pull request to fix it for me](https://github.com/atuttle/blog/).

[eleventy]: https://www.11ty.dev/
[svelte]: https://svelte.dev
[digital garden]: https://maggieappleton.com/garden-history
[webmentions]: https://webmention.io/
[swyx]: https://www.swyx.io/clientside-webmentions/
[all-contributors-bot]: https://allcontributors.org/
[guide]: https://sia.codes/posts/webmentions-eleventy-in-depth/
