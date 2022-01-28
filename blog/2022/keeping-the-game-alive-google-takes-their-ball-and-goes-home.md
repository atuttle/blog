---
title: 'Keeping the game alive after google takes their ball and goes home'
desc: "Google is shutting down free custom-domain accounts, even for grandfathered users, so it's time to do the thing we've all be putting off for too long."
img: /img/2022/christopher-campbell-syyBwqVX0Hc-unsplash.jpg
date: 2022-01-28
tags:
  - meta
  - google
---

![](/img/2022/christopher-campbell-syyBwqVX0Hc-unsplash.jpg)
Photo by <a href="https://unsplash.com/@chrisjoelcampbell?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Christopher Campbell</a> on <a href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>{class="photo-byline"}

Long ago, Google allowed anyone with the know-how to create a google account using a custom domain name. My website was previously `fusiongrokker.com` and the `adam@` email address was my google account. [As of December 6th 2012][legacy], they stopped allowing new signups for this free service, but existing accounts were grandfathered and remained free.

Earlier this year, Google announced that they're no longer going to be allowing the freeloaders to stick around for free. On July 1st free accounts for GSuite, including Google Docs, GMail, Google Drive, and more [will become past-tense][nomorefree]. If you like, you can choose to stick around for $6 per user per month. In fact, you have to pick a plan by May 1st. The clock is ticking. GMail, Drive, Docs, etc remain free as long as you don't mind using an `@gmail.com` email address.

## Not sure if you're affected?

![Google account selector, showing that Adam Tuttle is logged in using an @gmail.com email address](/img/2022/google_account.png){style="float: right;margin-left:15px;margin-bottom:15px;max-width:300px;"} I had a friend who wasn't sure if they were affected because they forward their email address at their custom domain to their gmail. If that's you, you should be fine.

You can confirm a couple of ways. Think about whatever service you're worried about losing your data in. Let's say Google Drive. Log into Drive and then click your profile picture in the upper-right. If it's an `@gmail.com` address, you're fine. If it's your custom domain, you're affected. Keep reading.

The other thing that you can do to confirm is to check the DNS settings for your domain. Here are mine:

![DNS configuration for fusiongrokker.com, showing MX records pointing to various googlemail.com domains](/img/2022/fusiongrokker_dns.png)

Note that I have MX records (for email) and they are all pointing to various subdomains of `google.com` and `googlemail.com`. This is a necessary step for setting up your domain to use GMail. If you don't have something similar, it's _almost_ guaranteed that you're not affected.

I'm pretty sure that using GMail for your domain isn't a requirement to use that email address as a google account, but chances are really good that if you wanted this account it was for the amazing GMail interface compared to the junk that was available as alternatives at the time.

## It's for the better

The fact of the matter is that shortly after they discontinued signups for new free domains accounts, those of us that stuck around started to feel unwanted anyway. Many services and features didn't work well, if at all, with custom domains. A few years back I got fed up with this and created a new `@gmail.com` to become my new primary account. But I had been using my `@fusiongrokker.com` email address as my primary since 2008, probably something like 10 years. It's not so easy to update every person, and worse, every online account that uses one email address to use the new one. And I'm lazy.

From my point of view, we (freeloaders) have no right to complain. They've provided some pretty great services for completely free (minus all the data they scraped out of our accounts) for a long damn time. I'm not surprised it's ending. I'm a little surprised and put-off by the short timeline.

Anyway, I'm a fairly heavy google-accounts user, so I'm going to have to figure a few things out and I figured it might be helpful to document the processes I'm using to keep my digital life moving forward. Here are the services that I use on the regular, and what I'm doing to deal with the loss of my free account:

### GMail

Fortunately enough, I was already on the path to migrating to an `@gmail.com` email address, thanks to needing it for things like YouTube Premium and Family Link (for controlling my kids' accounts), neither of which support custom domains. My blast radius for email is limited to:

- Setting up an autoresponder to notify anyone that emails me about my new email address
- Updating all three billion or so accounts I have online to use the new email address. Thankfully most of them will be easy to locate thanks to my long-time usage (and advocation) of 1Password. Still going to be tedious, but at least possible!
- There are definitely some accounts out there that use a username instead of email address, and thus don't pop out in my searches for the old email address in 1Password. For that reason, I intend to continue paying for the domain for at least another year, and [using Amazon SES to forward the emails][sesfwd] it receives to my new address.

### Google Calendar

This was originally the one causing me the most stress. I have several google calendars, some personal and private and some that I share with family. As it turns out it's quite simple to export and import your calendar data. You can export all calendars in bulk, or one calendar at a time, and importing them is as easy as going into **Settings > Import & export**. When importing you need to have an existing calendar to copy the events into. Just to be sure I would be happy with it, I started by importing into a new temp calendar I created for the purposes of testing. After looking at the result to confirm I was happy with it, I trashed that calendar and repeated the process with the real calendars. It took seconds of work (couched in minutes of anxiety).

### Google Voice

My primary phone number (as far as everyone that has my phone number is concerned) is a number provided through Google Voice, attached to my `@fusiongrokker.com` account. So not only do I need to vacate that email address, I also need to update my phone number everyhwere, too. There is an option to [transfer your number to a different google account][txfervoice], if you're happy with Google Voice, but I'm not. If I'm going to go through some trouble here I might as well put in a little extra effort to end up with the better experience.

Google Voice is _fine_, but the native Messages app on Android is _better_ and at least for the moment seems to be where Google is most likely to continue to invest in development. Voice seems to have fallen into the same void that GTalk, GChat, Google Wave, and other Google messaging apps disappeared into. I will be sad to lose the ability to make and receive voice calls through my web browser on my laptop, but it'll be a small price to pay for a UI that doesn't freeze up because you left the tab open for 24 hours. Not to mention the Google Assistant (Android phones, Android Auto, Google Home devices, etc) has no idea what Google Voice is. So hopefully I'll gain the ability to send and receive text messages through that, too.

### Google Photos

I really like Google Photos. The "AI" built into searching is really nice. I'm not sure yet if I want to give that up.

On the other hand, we recently added a NAS to our household network ([a Synology DS420+][nas]) and it has a similar feature to automatically backup photos and videos from your phone. Adding my wife and kids' photos and videos to the collection automatically sounds pretty great. I'm sure it won't be as nice or as handy as Google Photos. I also occasionally share things with friends and family and that would make it a little harder.

Either way, getting your photos is as easy as going to [Google Takeout][takeout], make sure you're signed into the correct google account (check in the upper-right corner), select Photos and a few export options (notify me by email, split zips at 2gb, etc), and wait for them to email you download links.

I don't think Photos has any sort of bulk-import that preserves the original file date. If you tried to re-upload the files you get back from Takeout, I expect they'll be marked as created on their upload date.

### GSuite (Docs, Drive, Sheets, etc)

Just like Photos, you can export your entire Google Drive contents from [Google Takeout][takeout]. They give you options on how you want each file type to be converted, for example your Google Docs documents could be converted to PDF or DOCX. After selecting Drive from the list of service data you want to export, click on the "Multiple Formats" button to see the options of how you want your files converted.

### Takeout For the Rest

There's a really good chance that [Google Takeout][takeout] covers everything else.

[legacy]: https://support.google.com/a/answer/2855120?hl=en
[nomorefree]: https://www.theverge.com/2022/1/19/22891509/g-suite-legacy-free-google-apps-workspace-upgrade
[txfervoice]: https://support.google.com/voice/answer/1065667#googlexfer
[sesfwd]: https://aws.amazon.com/blogs/messaging-and-targeting/forward-incoming-email-to-an-external-destination/
[nas]: https://amzn.to/33TFCf9
[takeout]: https://takeout.google.com/
