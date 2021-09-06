---
title: "Taffy 1.1 RC1 Available"
summary: "Taffy 1.1 RC1 Available..."
date: 2011-10-27 12:30:35
tags:
  - taffy
commentsPostId: Taffy-1-1-RC1-Available
---

I've been working hard, in my nooks and crannies of free time, to put together and release Taffy 1.1. Lots of stuff has changed for the better, and it's a pretty sweet upgrade, if I do say so myself.

Luckily, I haven't been working alone. To date, I've had community contributions in the form of code, help testing, and advice from (in no particular order other than that with which they came to mind) [Brian Panulla][1], [David Long][2], [Greg Moser][3], [Dan Lancelot][4], [Steve Rittler][5], and [Barney Boisvert][6]. There are more, I'm sure; and I'm deeply sorry for forgetting them/you!

But recently I realized that work has stagnated a little bit. Releasing version 1.1 has been held up for more than 5 months now almost entirely by my desire to add support for Railo. While I'm all for the open source movement (Taffy is open source after all), and the people working on and for Railo are some pretty nice guys, I just can't let that continue. So I'm going to release 1.1 soon, with or without Railo support.

Don't get me wrong, I'd still love to have it supported and I'm happy to review any pull requests anyone sends in. It's just that I've had a hell of a time getting a decent environment setup to run my tests and work out the kinks, and while there has been _some_ support from the Railo community, I'm afraid to say it's just not been enough.

So to that end, I'm posting **Taffy 1.1 Release Candidate 1 (RC1)** here today. You can [**download the zip**][7] and play with it, but the best thing you could do would be to clone from [the 1.1-rc branch on github][8] to make it easy to get the latest updates. So what's left to do before this release candidate is declared final? Most importantly, I need to finish the documentation updates. I've got a lot done that was published earlier today, and there's still some more to do. And of course, I need people to play with it and [report any bugs you find!][9]

And, if you're in a giving mood, I'll be keeping [the Railo branch][10] up to date. This branch is designated for testing and sharing Railo-specific fixes, and then once they are confirmed working in Railo and confirmed not to break against Adobe CF, I'll merge them into whatever the current dev/RC branch is.

I really hope that the Railo community can help me finish what's left to get their platform supported, but in the end it boils down to shipping 1.1 being more important --for me, at least-- than including Railo support.

Look for a post soon outlining some of what's changed since 1.0. I'm pretty excited about it! You can get a preview of that post [here on the roadmap][11], if you just can't wait.

<dl class="plugin-data">
  <dt>Taffy version:</dt>
  <dd>1.1 rc1</dd>
  <dt>Project:</dt>
  <dd><a href="https://github.com/atuttle/Taffy">https://github.com/atuttle/Taffy</a></dd>
  <dt class="install">Download:</dt>
  <dd class="install"><a href="https://github.com/atuttle/Taffy/zipball/1.1-rc">Zip from Github</a></dd>
</dl>

[1]:http://ghostednotes.com/
[2]:http://davejlong.com/blog/
[3]:http://www.gregmoser.com/blog/
[4]:http://www.danlance.co.uk/
[5]:http://www.countermarch.com/
[6]:http://www.barneyb.com/barneyblog/
[7]:https://github.com/atuttle/Taffy/zipball/1.1-rc
[8]:https://github.com/atuttle/Taffy/tree/1.1-rc
[9]:https://github.com/atuttle/Taffy/issues?milestone=1&sort=created&direction=desc&state=open
[10]:https://github.com/atuttle/Taffy/tree/Railo
[11]:https://github.com/atuttle/Taffy/wiki/Roadmap
