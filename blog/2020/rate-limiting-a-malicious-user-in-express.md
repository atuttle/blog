---
title: Rate Limiting a Malicious User in Express.js
desc: How we handled a bad actor attempting to use our application to verify stolen credit card information.
img: /img/2020/tarik-haiga-BxELNNMN88Y-unsplash.jpg
date: 2020-08-18
tags:
  - node
  - express
commentsPostId: rate-limiting-malicious-user
---

![Anonymous mask](/img/2020/tarik-haiga-BxELNNMN88Y-unsplash.jpg)

Here's an interesting problem! Someone started attempting to submit many donations through an online form we run for one of our customers. _Sounds like a pretty ok problem to have, right?_ Sure, when I explain it naïvely enough. Let's look closer.

To limit our [PCI DSS](https://en.wikipedia.org/wiki/Payment_Card_Industry_Data_Security_Standard) exposure, we use a credit card processing service that tokenizes the card details and handles communicating with payment gateways for us. The short version is that while you do enter your credit card details on our web app, they never hit our servers or end up in our logs and instead we get a token that we can use to initiate a payment.

We noticed a user submitting our donation form's final action, where we accept the credit card token along with the gift details, repeatedly. Not just repeatedly, but rapidly. So fast that they were obviously automating the requests and not simply clicking "submit payment" over and over. With the same token; which would not be representative of genuine transactions. A genuine user would tokenize once and submit that token once, and we should in theory never see that token used again.

You might be thinking, "This seems odd, but they're trying to give you money. What's so bad about that? 🤔"

At least, that was _my_ first reaction. But I've already spilled the beans; we think this was a malicious action.

There's no way to be sure, but here's what we think is going on. This person has aquired a list of stolen credit card numbers, and wants to find out if any of them still work. If they can attempt to make a $5 gift with each one, and a few of the cards work, then they've identified the useful numbers from the list and they can then put those cards to use to make bigger purchases elsewhere without having set off any alarms at the company that would be fulfilling that larger purchase. Better to tip off the recipient of a dozen $5 transactions than a dozen $800 transactions.

That's our theory, anyway.

How did we notice this? Well, we take a belt and suspenders approach to monitoring and reporting anomalous behavior. Of course the requests were all logged, but nobody could possibly keep up with the logs and also make forward progress on development goals. The logs are more for postmortem analysis. In addition to HTTP logs, though, we log all exceptions including failed payments, and in certain mission critical areas (like the one where people give you money out of the goodness of their hearts), every failure is worth looking at to at least confirm it was user error (credit limit reached, incorrect card number, etc). When something unexpected happens, we set off alarms. Literally. In addition to pushing notifications into Slack, we also alert our on-call developer.

We use OpsGenie (#notsponsored) to manage our on-call rotation, alert the on-call developer, and escalate if that developer doesn't deal with the issue in a timely manner. One of the must-have features was a way to wake the on-call person up, no matter what. OpsGenie has an app that, when given correct permissions, can "poke through" your phone's Do Not Disturb mode, set the volume to max, and play an alarm sound of your choosing. I'm currently using [sad trombone](https://www.youtube.com/watch?v=CQeezCdF4mk).

One Sunday evening we started getting a bunch of alarms. A slow but annoying trickle at first. Then right around midnight, our bad actor decided to open the flood gates. I have never heard so much sad trombone in my life. They triggered a continuous alarm that simply could not be ignored, even if no real harm was coming to our app or data.

With no other choice, I decided to shut down the online giving form for the customer under attack. (Mark this down as another reason to split your monolith up into microservices! Making that happen in a monolith would have required making some code modifications at midnight, groggy from interrupted sleep, with sad trombone constantly playing in my ears. Not ideal.)

After getting a few more hours of sleep, I gathered the team and we put our heads together on the right solution to get this particular brand of jerk-store to buzz off. We discussed adding rate limiting at the <abbr title="Web Application Firewall">WAF</abbr> layer, but ultimately decided it was the wrong tool for the job. The rate limiting controls there start with defaults like 1,000 requests per 5 minute window, which might be fine if you're dealing with general rate limiting, but aren't well suited for a targeted attack on one URI. Even if we set it to a relatively low value like 100 requests per 5 minutes, that's still allowing another request every 3 seconds or so, indefinitely.

That would not be much of an improvement over continuous sad trombone.

Fortunately, this microservice is built on Express.js, which means it has a huge community of free and open source plugins waiting to be taken advantage of. We eventually settled on [Express-Brute](https://www.npmjs.com/package/express-brute), which allowed us to apply a rate limit specifically to the one route in question, and configure it exactly how we wanted.

We went with a fibonacci-sequence-based cooldown after a couple of "free" retries. Leaving some wiggle room for genuine donors to make mistakes seemed like the right approach. Our fibonacci cooldown starts at a couple of minutes, and very quickly spirals out to a full hour cooldown, with something like a 5-8 hour memory. The theoretical maximum number of requests our bad actor could make in 24 hours is now far fewer than even just the number of attempts they made between 12:00 and 12:01 on that Monday morning.

I was able to add all of that with only 19 new lines of code to import, setup, and use the plugin. The plugin itself is very small, and its dependencies are pretty dang limited considering how significantly it just saved our bacon!

The service has been back online for quite some time now and we've seen the malicious actor make a couple more attempts, but the change seems to have done its job and sent them off to find another credit card form to abuse.

I never imagined I'd write code to reduce the frequency of someone giving us money, but here we are.
