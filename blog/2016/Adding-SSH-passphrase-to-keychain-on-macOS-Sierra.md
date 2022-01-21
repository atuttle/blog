---
title: 'Adding SSH Passphrase to Your Keychain on macOS Sierra'
desc: 'In which Adam adds to his public system configuration notebook regarding SSH key passphrases and short term memory thereof.'
img: /img/2016/scott-webb-lnRPKo7Lo5Q-unsplash.jpg
date: 2016-12-19 08:00:00
tags:
  - osx
---

![Keys hanging from a lego brick used as a keychain attached to some lego bricks on the wall](/img/2016/scott-webb-lnRPKo7Lo5Q-unsplash.jpg)
Photo by <a href="https://unsplash.com/@scottwebb?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Scott Webb</a> on <a href="https://unsplash.com/s/photos/keychain?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>{class="photo-byline"}

The truth is that I just don't have anywhere better to jot this down for my own future reference, so I'm inflicting it on the world as another blog post. I guess it could prove helpful to some people too, so there's that.

Due to [a recent security announcement][hack], I decided it was time to stop putting off my upgrade to Sierra.

https://twitter.com/AdamTuttle/status/809832821045006336

After dinner that night I forgot to make sure my latest Apache config changes were checked into git and took the plunge. A couple of hours later and I was back on my feet. For what it's worth, not much has changed in the day to day operation of my computer, so that's good.

However, one thing I noticed quickly &ndash;aside from the fact that Apple brazenly threw out anything they deemed unnecessary in my Apache config, as they always do&ndash; was that I was now required to enter my SSH passphrase every time I use ssh.

![SSH passphrase required](/img/2016/ssh-passphrase.jpg)

In general I would say this is a good thing. I am pro-security. But I use ssh for my git repos and I'm pushing and pulling commits all day long. Entering my password 50+ times in a day doesn't sound fun. I use whole-disk encryption, a strong system password, require my password immediately after the screen saver kicks on, and have developed a healthy habit of throwing my mouse cursor into the hot-corner that activates the screen saver if I have to leave my laptop unattended.

Also, I work from home so I more frequently go outside in my slippers than leave my laptop on a desk in an office while I use the restroom. (I estimate this at about a 200:1 ratio. I really like my slippers.)

While conceding that it is _slightly less secure_ now, I also feel that requiring it so often before was overkill. I asked on Twitter if anyone had advice, and as it so often does, [the internet delivered][cwb].

First, [add the key to the keychain][keychain]:

```bash
$ ssh-add -K /Users/atcodes/.ssh/id_rsa
```

Note that the absolute path to the key file is used, not `~/.ssh/id_rsa`.

Then, [add this file][boot] as `~/Library/LaunchAgents/ssh.add.a.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>ssh-add-a</string>
    <key>ProgramArguments</key>
    <array>
        <string>ssh-add</string>
        <string>-A</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
</dict>
</plist>
```

You can create it from your terminal with this one-liner: `curl -o ~/Library/LaunchAgents/ssh.add.a.plist https://raw.githubusercontent.com/jirsbek/SSH-keys-in-macOS-Sierra-keychain/master/ssh.add.a.plist`

This adds a startup task that will run `ssh-add -A` every time you restart your computer.

Now your SSH passphrase isn't required quite so often.

[hack]: https://motherboard.vice.com/read/this-300-device-lets-you-steal-a-mac-encryption-password-in-30-seconds
[cwb]: https://twitter.com/AdamTuttle/status/810117274355040256
[keychain]: http://superuser.com/questions/1127067/macos-keeps-asking-my-ssh-passphrase-since-i-updated-to-sierra
[boot]: https://github.com/jirsbek/SSH-keys-in-macOS-Sierra-keychain
