---
title: 'Welcome to OSX, Evergreen Edition'
desc: 'A collection of tools I use to customize my Mac, and be productive as a web developer on a day to day basis.'
img: /img/2016/andras-vas-Bd7gNnWJBkU-unsplash.jpg
date: 2024-01-05 13:30:00
tags:
  - osx
---

I had an old version of this article [written in 2016 <span style="font-size: 50px">👴🏻</span>](/blog/2016/welcome-to-osx-2016-edition/), but obviously a lot has changed since then. Instead of rewriting it every few years, I'm going to designate this as the "evergreen" version. I'll update it as I find new tools that I like, or as my workflow changes.

## Fundamental Improvements: Finder, Terminal, Launcher

It took me a while to not be annoyed by Finder. There were other things I used ([TotalFinder][totalfinder]) or looked at from a distance ([Path Finder][pathfinder]), but after many years either it has improved or I've changed enough that vanialla Finder does the job.

To be honest, the default Terminal app is _fine_, and miles ahead of Windows CMD or PowerShell. But since when is _fine_ good enough? You have a variety of good options to choose from on Mac. I'm currently using [Warp][warp], but if that wasn't an option I'd be using [iTerm2][iterm]. I have <code>ctrl+\\</code> configured as my terminal "visor" shortcut. I leave it running 24x7 and can use that keyboard shortcut to bring up a terminal window no matter what I'm doing.

Having tried a bunch of different options, I've settled on using [Raycast][raycast] as my launcher/utility app. It's a great launcher (think: Alfred), with window management, clipboard history, and a bunch more features all baked in for free; including the ability to make your own extensions with JavaScript. I also happen to like their AI Chat interface, so it's one of the few things I pay a subscription for.

As crazy as it sounds, even inheriting an extra modifier key with OSX ("command" in addition to shift, control, and alt) I still occasionally find myself wishing for another. So I use the Raycast feature to map the CAPS LOCK key to cmd+ctrl+alt+shift, which some people call "hyper." I've used other solutions to the same effect in the past, but the bit that makes Raycast the best at it is that their implementation doesn't ruin your ability to use the caps lock button as caps lock, on the rare occasion it would be handy.

## Developer Stuff

In my terminal, I prefer to use Zsh with [Oh-my-zsh][omz]. There are dozens of great plugins and even more themes to choose from.

I write my code in [VS Code][vscode]. For the most part I think I use the default keyboard shortucts, though I have added and modified a handful that I'll have to come back and add at some point. [This was my sublime keymap][keymap], and I probably ported some of that over. Extensions I use:

- Apache Conf
- Auto Rename Tag
- Better Comments
- Bookmarks
- CFML
- Cloak
- Disable Ligatures
- Docker
- DotENV
- embrace
- ESLint
- FileUtils
- GitHub Actions
- GitHub Copilot
- GitLens
- Import Cost
- JavaScript and TypeScript Nightly
- Material Icon Theme
- npm Intellisense
- PostCSS Language Support
- Prettier
- Rainbow CSV
- shadcn/svelte
- sort lines
- Svelte for VS Code
- Svelte Intellisense
- Tailwind CSS IntelliSense
- Template String Converter
- Text Pastry
- Thunder Client
- Todo Tree
- Total Typescript
- Twoslash Query Comments
- Wrap Console Log
- YAML

I also write my blog posts in VSCode using Markdown. It's all [hosted on GitHub][blog], actually. For managing MySQL databases (local and remote) I use [Sequel Ace][sql].

Pretty much everything else that I use near-daily is [Node.js][node] and node modules. If you just need to stand up a quick basic static-file web server in a random directory, I like [nws][nws].

On the off chance that you need an (S)FTP/S3 client, [Transmit][transmit] is pretty good.

[Microsoft Remote Desktop][rdp] is actually reasonably good for managing a few windows boxes remotely, but [Royal TSX][royal] is better.

Most of the time I do my Git work in the terminal, but occasionally I'll want a GUI for block-level staging or history browsing. In those cases I like [lazygit].

I use Keynote for presentations where I won't be doing any live code demos, or various web presentation frameworks when I am.

## Other Great Stuff

You _will not find a better password manager_ than [1Password][1p]. Fast, secure, and beautiful to boot. Integrates really well with major browsers and has system keyboard shortcuts for quick access. It also integrates well with iPhone and Android for on-the-go access to your passwords with minimal inconvenience. I forced it on my wife, kids, and my mom, too. BONUS: if your company uses a 1Password business license, every employee-user gets a free family account, too!

All of the computers in my house backup to [Backblaze][backblaze].

For email, I've tried a bunch over the years. None are ever as good as straight up webmail. That said, _all_ of my email is through Google Mail. If you have a work Exchange server or something, I can understand why you would want a local native client. I just don't have a recommendation for you. Lately I've been using [Mimestream][mimestream] as a native mail client because it has good integration with gmail, and the least-awful dark mode I've seen.

I have access to more than a dozen google calendars, and coordinating them can be a real pain. I really like [Notion Calendar][notioncalendar] (formerly: "Cron").

I have tried just about every to-do app there is, and none of them are perfect for me. I need some amount of organizing and bucketing (e.g. separate work and personal, and different projects within work), and I want instant sync between my phone and my computer. I don't have many recurring tasks, but I do have a couple that I could live without if I had to. Currently I'm using [Things]. Yes, it's expensive for a todo app. Yes, I paid for it twice so I could have it on both my phone and my Mac. Yes, that's insane. But that's where I've found myself at the moment. 🤷🏻‍♂️

I have used [LibreOffice][libre] for office documents (word, excel, etc), but the modern apps from Microsoft aren't half bad. Whatever you do, [don't use OpenOffice][notoo]!

If I need to record some or all of my screen, I always use QuickTime Player (which should come on your Mac). I don't do a ton of video editing yet, so iMovie is still sufficient for my needs. I see [FinalCut][finalcut] in my future, though. Just like Windows, the best video player is [VLC][vlc] hands down.

Need to figure out what's eating up so much disk space? Try [Disk Space Analyzer][disk].

[tcmd]: http://www.ghisler.com/
[pathfinder]: http://www.cocoatech.com/pathfinder/
[totalfinder]: http://totalfinder.binaryage.com/
[iterm]: https://www.iterm2.com/
[raycast]: https://www.raycast.com/
[omz]: http://ohmyz.sh/
[keymap]: /blog/2013/My-Sublime-Keymap-Common-KB-Shortcuts/
[sql]: https://github.com/Sequel-Ace/Sequel-Ace
[blog]: https://github.com/atuttle/blog
[node]: https://nodejs.org/
[nws]: https://github.com/knpwrs/nws
[transmit]: https://panic.com/transmit/
[rdp]: https://itunes.apple.com/us/app/microsoft-remote-desktop/id715768417?mt=12
[sourcetree]: https://www.sourcetreeapp.com/
[1p]: https://agilebits.com/onepassword
[backblaze]: https://www.backblaze.com/
[libre]: https://www.libreoffice.org/
[notoo]: http://www.theguardian.com/technology/askjack/2015/sep/03/switch-openoffice-libreoffice-or-microsoft-office
[finalcut]: http://www.apple.com/final-cut-pro/
[vlc]: http://www.videolan.org/vlc/index.html
[royal]: https://royalapps.com/ts/mac/features
[warp]: https://www.warp.dev/
[mimestream]: https://mimestream.com/
[notioncalendar]: https://www.notion.com/product/calendar
[obsidian]: https://obsidian.md/
[disk]: https://nektony.com/disk-expert
[vscode]: https://code.visualstudio.com/
[lazygit]: https://github.com/jesseduffield/lazygit?tab=readme-ov-file#elevator-pitch
[Things]: https://culturedcode.com/things/
