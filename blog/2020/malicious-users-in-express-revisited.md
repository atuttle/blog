---
title: Malicious Users in Express, Revisited
date: 2020-09-18
tags:
  - node.js
  - express
commentsPostId: malicious-users-in-express-revisited
---

Back in August I wrote about [how we added some rate limiting to an Express.js application to thwart someone using an online donation form -- ostensibly -- to verify stolen credit cards](/blog/2020/rate-limiting-a-malicious-user-in-express/). That worked ok for us, _for a while._

Eventually the attacker came back, and this time they were much more determined to accomplish their goal, even if it was going to take them a while. The problem with the brute-force protection that we added is that it has to have some leeway for legitimate users. It's not unheard of for a person to have a declined card or even two, so you have to allow at least a few retries without any cooldown period enforced.

Further, we found that our donation form is such a usable interface that school staff are using it to charge some credit card gifts submitted via paper forms. This makes it totally legitimate for a single person (ip address) to make 10 or more donations in a single day; so a per-day limit is out of the question.

Add to that the ease of browsing through the Tor network to change your IP constantly, and brute force protection alone was not enough to protect us. This attacker would sometimes disapepar for days at a time before returning to submit a burst of 20+ charges in a single morning, spaced out to avoid being throttled.

So here's what we changed.

To allow staff members to continue using our gift form as an easy way to digitize a paper gift we do have to reset the brute-force-request-counter after each successful charge, which at face value might seem like a bad thing (more opportunities for fraudulent charges), but doing so gave us the confidence to clamp down the other parameters of brute force prevention. We're still using a Fibonacci spiral cooldown, but it starts with a larger number and that makes it increase more rapidly. We also reduced the number of cooldown-free retries to just two.

![Screen shot of Google's infamous "I'm not a robot" checkbox CAPTCHA](/img/2020/Im_not_a_robot.jpg)

More importantly, we added a CAPTCHA. We resisted this for a long time, in part because having 3rd party scripts on the page where someone is entering their credit card information is a big risk, [PCI](https://www.pcisecuritystandards.org/)-wise. Ultimately it became clear to us that while there is some risk, there's simply no choice in the matter. Without a CAPTCHA there's no way to be certain that the request is coming from a human and not a bot; and the small PCI risk is well worth it to not have to clean up dozens of fraudulent/incomplete gifts every week as well as the potential hit to your gateway reputation. Gateways don't much care for you if you can't keep fraudulent activity away.

As tempting as it was to go down the rabbit hole of looking for signals to detect bot requests, we are not in the machine learning business and it was a smarter move to outsource that determination to someone who has the resources and the motivation to perfect it. Yes, we used [Google's reCAPTCHA](https://developers.google.com/recaptcha/).

We know that everyone is sick of training Google's self driving vehicle algorithms to detect motorcycles, stop lights, and crosswalks, so we were delighted to find that there's [**a version of reCAPTCHA that's invisible in most cases**](https://developers.google.com/recaptcha/docs/invisible). It works like a regular captcha except that it stays invisible -- doesn't even require you to click the "I'm not a robot" checkbox -- unless it's unsure whether or not you're a bot.

For most of our users, they should never notice a difference. And for those that get the CAPTCHA, at least we know they're being served something accessible and that meets (is!) the industry standard for the test.

Mostly this whole post was just inspired by the fact that there is an invisible version of reCAPTCHA available. I had no idea until we resigned ourselves to the fact that we had no choice but to add a CAPTCHA, and now we'll probably be adding it in more locations to protect our customers from fraudulent charges and abusive data cleanup.

I love it when a moment of sadness can be turned into a moment of happiness.
