---
title: 'Hackintosh Part III: Daily Driver'
desc: I built a Hackintosh over a year ago. How well has it been working for me? What's the good, the bad, and the ugly?
img: /img/2020/little-john-Z54rB8BhG48-unsplash.jpg
date: 2020-02-25
tags:
  - apple
  - productivity
  - hackintosh
---

> This is part three in an ongoing series where I document my experiences building my first Hackintosh.
>
> - [Part one: My motivations, and hardware I purchased](/blog/2019/building-a-hackintosh-2019/)
> - [Part two: Hardware build complete, OS Install "feature complete"](/blog/2019/building-a-hackintosh-2019/)

It's been almost a year since I embarked on the journey of attempting to replace my Mid-2014 model Macbook Pro with a custom built Hackintosh, so we're way overdue for an update.

Spoiler alert: The reason this update seems so overdue is that it's been going so well that I've been head-down on work and personal stuff. So that's great news.

With that in mind, let's start with...

# The Bad Stuff

## I can't install any OS updates

That primarily means security patches. I'm not extremely worried about this, because this machine doesn't leave my house (it's not a laptop), I'm the only user, and I can and do easily avoid worms spread through email, messenger clients, etc. I know that doesn't protect everything, and _that's_ why I've left a little bit of room for worry. I do worry, but obviously not so much that it's worth paying the Apple hardware tax.

And for what little it's worth, there are _some_ updates (cough, Catalina, cough) that are simply not acceptable for me yet. Some apps don't support Catalina yet, and I need those apps more than I need a random OS upgrade.

I'll talk more about OS updates in **The Good Stuff**, below.

## USB is a little bit flaky

Not flaky as in things stop working at random times, but that certain USB ports work and others don't, and my USB hub doesn't always agree with OSX. For example, I bought a [tiny USB micro-sd card reader](https://amzn.to/3a4RwQB), and plugging that into my USB hub only mounts the memory card as a volume maybe 1 out of 10 times. I can either use a non-hub USB port to get that working, or boot into Windows to offload my files. Since offloading my files usually entails dumping them into cloud storage, it doesn't much matter where I do it. The only time it's been a nuissance is when I want to take footage from my GoPro and edit it immediately. A small price that I'm more than happy to continue paying in exchange for the other benefits.

I know there are various hackintosh USB drivers available to try out, but to emphasize how little this problem bothers me, I haven't found it worth my time to try fixing the problem.

## The OS thinks that there's an Apple webcam/microphone available

As a remote worker, 90%+ of my meetings are web conferences using my webcam and microphone. I'm using a USB webcam to act as both of those, but that doesn't stop the OS from expecting the built-in webcam and microphone that it would have on any modern Apple hardware. It hasn't been an issue once I got things configured initially, but each app that uses the webcam and/or microphone will need to be told to use the USB options, not the "built-in" (missing) options.

## I can't run any virtual machines

I don't use VM's much. As a webdev on OSX, it would be nice to be able to test something out on Edge or IE11 occasionally, and [Microsoft provides free VM's for exactly that purpose](https://developer.microsoft.com/en-us/microsoft-edge/tools/vms/). Alas, booting a virtualbox VM on my hackintosh instantly crashes it. I've managed not to suffer from this, but it has been annoying once or twice in the last year.

# The Good Stuff

This is fine! And I actually mean that, not in the dog-in-flaming-room sense.

![](./images/this-is-fine.jpg)

I'm just as productive as ever. Arguably more, with a faster CPU, dedicated GPU, and 4x more RAM. Aside from being unable to run virtual machines and the feeling of unease from not being able to install OS updates, as a daily driver, I've reached 100% of my productivity goals.

## OS Updates are possible, just not as easy

After each OSX update, the Hackintosh community is hard at work making it possible to install from scratch with that new latest version. So when I get far enough behind, and/or an upgrade becomes actually necessary, or when Amazon can start delivering free time in boxes with smiles on them with free next-day shipping, then I can give it a shot.

And here's the great thing about this whole hackintosh process. The safest path forward when attempting these changes is to clone your OS SSD onto a spare, try the upgrade, and if it doesn't work out, clone back. Worst case scenario, you've burned a couple of hours and lost nothing [but time](/blog/2020/time-is-all-you-have/) in the process.

If it works out, then you install the apps that you use that aren't cloud services, and get back to work. Maybe you burn a day in that process? And let's be honest, who among us doesn't revel in the thought of moving into a freshly installed and pristine OS?

## I've also got my gaming computer

One of the not-so-secret bonuses of building a hackintosh was that I would wind up with a computer capable of dual booting into Windows and, gasp, being able to play modern games.

My dual-boot Windows installation is not without its own quirks (perhaps for another time), but it serves its purpose just fine. It's been many years since I've had a Windows gaming computer at my disposal, and I've had a lot of fun getting into Steam for the first time. (I know, right?! 😱) I switched to Mac as my primary/only computer around 2008-2010, and while that's been great for work it's also meant I completely lost touch with PC gaming.

# What would it take to move to a new machine?

I mentioned before that OS updates/upgrades are relatively painless. First of all, in 2020, the cloud is pretty great.

For work purposes, I need: Slack (which I can use in a browser tab in a pinch), 1Password, Dropbox (mostly for 1Password team vault sharing), my VPN client, VS Code, node/npm, our various project git repositories, Docker, iTerm, and a browser or two. Chrome does a nice job of syncing my extensions and bookmarks. I have a private git repo with my dotfiles, which include things like my oh-my-zsh config and a crapload of command aliases and shortcuts that I've created and made habits out of over the years.

> As much as [I would prefer to use Firefox as my daily browser](/blog/2019/making-firefox-usable-on-osx/), it just can't keep up with Chrome, even in basic page rendering speeds. When your job is managing websites, a second here and a half second there add up really quickly. I had to abandon my morals and go back to Chrome. 😭

That's enough to get by on for work in a pinch, and I think I could get that all on its feet in a half day or less. So what nice-to-haves does that leave?

Here are a bunch of things that aren't critical path, but that make life as a developer or general OSX usage happier for me: [Clipy](https://github.com/Clipy/Clipy#readme), [Skitch](https://evernote.com/products/skitch), [Rocket](https://matthewpalmer.net/rocket/), [Bartender](https://www.macbartender.com/), [Fantastical](https://flexibits.com/fantastical), [Sequel Pro](https://sequelpro.com/), Slack ("native" app), Sourcetree, [Alfred](https://www.alfredapp.com/), [Disk Inventory X](http://www.derlien.com/), [Karabiner Elements](https://pqrs.org/osx/karabiner/), [Magnet](https://magnet.crowdcafe.com/), [Medis](http://getmedis.com/), Trello, and VLC.

And these things are entirely for fun: [OBS](https://obsproject.com/) (for streaming), Final Cut Pro, and [GIF Brewery](https://apps.apple.com/us/app/gif-brewery-3-by-gfycat/id1081413713).
