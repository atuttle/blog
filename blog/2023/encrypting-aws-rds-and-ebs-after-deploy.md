---
title: Encrypting AWS RDS and EBS after deploy
desc: You accidentally deployed EC2 instances or RDS instances with un-encrypted storage. Now what?!
img: /img/2023/everyday-basics-GJY1eAw6tn8-unsplash.jpg
date: 2023-02-28
tags:
  - aws
  - rds
  - ebs
  - encryption
---

![An old fashioned metal key](/img/2023/everyday-basics-GJY1eAw6tn8-unsplash.jpg)
Photo by <a href="https://unsplash.com/@zanardi?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Everyday basics</a> on <a href="https://unsplash.com/photos/GJY1eAw6tn8?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>{class="photo-byline"}

We unexpectedly found ourselves with some AWS RDS databases using unencrypted storage; as well as some EC2 instances using root EBS volumes that were unencrypted.

_Crap._

For a variety of reasons, that's not good.

And look, I'm not here to point fingers, but some chowder-head (me! 👉 😩 👈) put us into this situation, and now we need to get ourselves out of it. So, how do you do that with minimal downtime?

I'll take EBS first, because that one is simpler, and I did it first.

### Encrypting the root EBS volume of an EC2 instance

I believe that AWS will allow you to encrypt-in-place &mdash;while the instance is running, even!&mdash; but not if it's the root volume.

Here's what I ended up doing:

1. If you're regularly generating files and storing them on the volume, and you can't lose any of them during the brief downtime, then you'll need to shut down the instance first and be prepared for a few extra minutes of down time. On the other hand, if files are rarely written and you don't mind if logs are missing a couple of minutes of history, you can take a snapshot while the instance is running and only shut the instance down for a minute or two when we get to step 4 below. Either way, you need to make a snapshot of the volume.
2. Make an encrypted copy of the snapshot. Choose the make a copy action, and there's a checkbox to encrypt the copy. Make sure that your snapshot copy is in the same region as the existing volume. The copy wizard doesn't pre-fill smartly.
3. Once you have your encrypted snapshot (copy), create a new encrypted volume from your encrypted snapshot.
4. You're now ready to shut down the instance (if you haven't already) and swap the volumes.
   1. Before you detach the unencrypted volume, note the device name. (e.g. `/dev/hda1`) You must attach the new volume with the same device name.
   1. Detach the unencrypted volume
   1. Attach the encrypted volume (with the same device name)
5. Restart your EC2 instance.

I did about a half dozen of these one Saturday morning, and got them all done in less than an hour.

### Encrypting the storage of an RDS instance

This one's trickier. If you're anything like us, your databases use a lot more storage than your app servers. The approach is going to be mostly the same, but of course you probably can't (we definitely couldn't) allow the data to change between snapshot and encrypted restore. So, with hat in hand, I informed our affected customers that we would be having a scheduled maintenance window on a Sunday afternoon for about 5 hours. (Spoiler alert: I finished with about 30 minutes to spare!)

I don't know if it will affect the available options, but it's worth mentioning: We're using AWS Aurora (MySQL Compatible).

1. Block all web traffic to the applications that use the database. I added an ALB rule that returned a fixed 503 response with a "down for scheduled maintenance" page.
2. Disable all scheduled microservice executions that would affect the database. For us, this meant shutting down some Fargate services, and disabling some EventBridge events that would trigger Lambdas on a schedule.
3. Snapshot the database. **DO NOT** "stop" the database. You can't snapshot a database while it's stopped, so it's pointless at this step. It also takes a _long time_ to stop a database, and even longer to start it back up.[^1]
4. Now that you have your database snapshot, **DO** "stop" the database. That's the best way to prevent any unexpected DB changes. Fortunately you don't have to wait for the stop to complete before you can move on to the next step.
5. Restore from your snapshot. This will take you to a wizard to create a new cluster. Make sure that you choose to encrypt the new cluster!
6. Once you've submitted the cluster creation wizard, creation will begin, and it will be immediately assigned a hostname. You probably need to put the updated hostname into some configs somewhere, right? Now's the time to do that, and do any necessary deploys to get the new hostname out to all the places that need to use it.
7. You can add additional instances to the cluster before the first one is complete, if you want.
8. Once the cluster created and fully started and available, connect to it with your DBMS software and poke around to make sure it looks as expected. Got all of the databases and users? Data looks recent?
9. Allow traffic to once again flow to the web apps and microservices. Don't forget to re-enable any schedules that you disabled.

I spent about 2 hours doing the database work described above, and another 2.5 or so updating configs and doing deploys to get the updated hostname config everywhere it needed to be. I made some mistakes along the way that slowed me down, but thankfully I estimated conservatively and managed to get it all done within the allotted maintenance window.

### Encrypted By Default

If you're running a business, you should be using encrypted storage. Not only does it just make sense, but sooner or later you're going to run into compliance regulations that will require it, so you might as well choose it from the start.

You can also enable encryption by default to help you and your team choose the right option when creating new EBS volumes. Here's [how to enable encryption by default for EBS volumes](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSEncryption.html#encryption-by-default). I can't find a document on enabling encryption by default for RDS, but I bet it's possible somehow.

[^1]: Ask anyone who's accidentally stopped the wrong database. (Speaking from experience...)
