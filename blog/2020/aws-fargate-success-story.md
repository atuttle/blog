---
title: My (First) AWS Fargate Success Story
desc: AWS Fargate is amazing and easy to use, once you get to know it.
date: 2020-01-24
img: /img/2020/rihards-sergis-4Yuz1DZbZ0k-unsplash.jpg
tags:
  - cloud
  - aws
  - docker
commentsPostId: fargate-1
---

You guys. AWS Fargate is amazing! #notsponsored

I started writing this article back in August of 2019, but ended up setting it aside because I didn't know where I wanted to take it. The story that I'm about to tell you ended fantastically for us, and we've since gone on to have even more success with Fargate, so I am happy to sing its praises from the mountaintop.

Back in August we did a thing that was scary and exciting, and it went far better than we ever could have expected. Indeed, far better than developers are conditioned to expect.

We took some code that was designed to run on AWS Beanstalk, and redeployed it on AWS Fargate, and it _sorta just worked._

Sounds pretty major, right? I figured it would take a week of tweaking knobs and reading overly enterprise-y documentation to find the right incantation to make things work the way we needed. It didn't. We were on our feet in just a few hours. Things went so well that we got scared. _What are we forgetting or missing? When will the other shoe drop?_

https://twitter.com/AdamTuttle/status/1162118705909850112

### Our Beanstalk app, and why we had to change solutions

We send a lot of email. More specifically, our customers (colleges and universities) send _a lot of email_. One part of that process involves flinging api requests at our mail provider as fast as we can (and updating database records to reflect that they've been sent). To reach our desired throughput, we use a small orchestra of relatively long-running (for Lambda, at least) AWS Lambda functions to make the api requests. Each function is in constant contact with a sort of &mdash;to continue the orchestra metaphor&mdash; "conductor" process that is responsible for keeping tabs on each musician and controlling them to limit our api usage, aiming to get us as close to the rate limit as possible without going over.

The conductor keeps track of how many emails have been sent during a calendar-minute (that is, not a rolling 60-second window, but from 11:27:00.000 to 11:27:59.999) across all running Lambdas, and uses some math on recent throughput and configured limits to decide whether or not to assign a given Lambda thread a new batch of emails to send when it checks in between batches. The Lambda will either be given a new batch, in which case it gets right to work sending them, or it will be told to check back later. The Lambdas themselves keep track of how long they've been running and if they're too close to the timeout deadline they shut themselves down between batches instead of asking for more work. The Conductor also manages the orchestra of running Lambdas. If there's more work that we can fit in during this calendar-minute and we're below our configured max concurrent Lambda workers, it will invoke the Lambda function again, asking it to join the orchestra.

For a particularly large message, we might be sending ~4,500 emails per minute for an hour straight, and use 20-30 Lambda invocations over the course of that hour, but only 3-5 concurrent at any given moment.

Previously, we ran the Conductors on Beanstalk. We had one instance per customer, in part so that we were sure not to let volume from one school affect throughput of another.

It's worth noting that Fargate seems to have been announced [in November 2017][fargate-announcement], and our initial work building the Conductor/Lambda process was done in February of 2018. Not only would we have avoided adopting the service so soon after it launched, but I think that we just didn't know about it. At the time we were a 3 person company, far too busy getting work done to keep up on all of the AWS announcements. In fact, we wrote the majority of the code for this email processing service over one fast paced and sleep deprived weekend. We went with what we were already familiar with -- _at least familiar enough_.

This system worked well enough from February 2018 until last week, so why change?

**We ran out of Elastic IP Addresses. (EIPs)**

Beanstalk currently supports two "tiers", one for workers which is intended to consume work items from an SQS queue (not a good fit) and the other for web applications. Though we didn't want any auto-scaling (one of the primary benefits of Beanstalk), it was otherwise a good fit because in additioning to managing the orchestra, we wanted the Conductor to have a web interface where we could watch real-time graphs of throughput and the number of running Lambdas over time, and to allow us to tweak some variables in the process to make sure it was humming along efficiently. We could package up our code as a zip file and deploy it and didn't have to worry about managing the EC2 instances, or wiring up nginx, or a hundred other little things you have to do when you manage your own EC2 instances. This worked really well for us for a long time... But the down side was that every web-tier Beanstalk environment requires you to allocate it one of your Elastic IP addresses. We blocked all external traffic to our Beanstalk apps, so having the EIP was pointless, but it was well worth the $3 EIP rental fee to not have to worry about it.

If you didn't already know, IPv4 addresses are kinda scarce... Not as urgently terrifying as Y2k was in 1999, but scarce enough that each AWS account gets an initial limit of 5. When we hit that limit after a year or so of creating these Beanstalk apps as needed, we figured we'd find a better way later, and asked AWS to grant us a few more IP addresses. Thankfully they obliged. But of course...

https://twitter.com/CodeWisdom/status/1162342494711033856

We completely forgot about the problem until we ran out of IP addresses again. And of course this time there was no time to waste. It was time to deal with this problem head-on.

### Fargate to the rescue

Thankfully my coworker Chad has a personal interest in AWS service offerings and in the meantime had become passingly familiar with Fargate, so we at least had a name for something we should look into. We made a quick list of the things that we absolutely had to be able to get out of our new solution:

- It can't consume an EIP (or at the very least, we have to be able to turn that off)
- It had to be possible to set environment variables that our code could pick up and put to use to configure itself
- It had to be able to determine its private IP after launching and create/update an entry in Route 53 so that a hostname could be used for routing messages between the Lambdas and their Conductors.

Fargate also happens to work by running your Docker containers, and this is an area we've been wanting to push into more anyway. Win/win!

I quickly made a one-file application that could test all of these requirements, wrapped it up in a docker container, created a registry on AWS Elastic Container Registry, pushed in the test application container, and spun up a Fargate cluster/service/task.

As it turns out, Fargate was able to do all of that and much more.

It took a good week of tinkering before I really understood the distinction between Fargate Clusters, Services, and Tasks and why they are different &mdash;probably because this app is one container that doesn't need to cluster, or scale, or connect to any sibling service containers&mdash; but with that established, it (Fargate) now feels like it's the sharpest tool in my belt and my instincts now want to use it on every problem. In the meantime, even though I didn't grok it all, we were able to be productive through trial and error.

The hardest part of moving our app turned out to be figuring out how to package it up in a Docker container and publish that container to our registry. We've used Docker before but mostly for local development type purposes, like running a Redis server locally without installing it on your machine. Figuring out the similarities between Docker and Git, and understanding how to build locally and push to a remote registry was the most difficult step, but even that wasn't overly difficult.

Building on some advice from an old friend [Mark Mandel](https://twitter.com/neurotic), we added a `Makefile` to the project to handle container builds and publishing duties with a couple of simple commands.

With the app successfully wrapped in a container, and the container published to our registry, the only thing left to do was to figure out how to deploy it on Fargate. And that's where the cloud shines! We had a few false-starts where we messed it up and had to trash it and start over, but the only cost was a few cents in compute resources, and our time. Eventually we figured out the right configuration and we had everything we needed.

Maybe next time I'll tell you how we've reinvested those winnings back into Fargate, what sort of awesome improvements we've already made elsewhere in our app, and what sort of awesome improvements are still on our horizon!

I know I sound like a bit of a fan-boy here, but that's only because I am. I am all too excited to have figured out how to use Docker and Fargate to _get stuff done_, and getting stuff done makes me happy.

[fargate-announcement]: https://aws.amazon.com/blogs/aws/aws-fargate/
