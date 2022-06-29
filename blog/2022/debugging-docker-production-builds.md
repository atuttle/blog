---
title: Debugging Docker Production Builds
date: 2022-06-29
desc: A quick reference on how to browse the contents of a production docker image
img: /img/2021/barrett-ward-5WQJ_ejZ7y8-unsplash.jpg
tags:
  - docker
---

![Shipping containers in a busy port](/img/2021/barrett-ward-5WQJ_ejZ7y8-unsplash.jpg)

Photo by <a href="https://unsplash.com/@barrettward?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Barrett Ward</a> on <a href="https://unsplash.com/s/photos/container?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>{class="photo-byline"}

Filing this one under things that I'm writing for my future self to reference.

Who among us hasn't had the experience where you're getting a bug report for a bug that you know you fixed, and it seems like your fix is just being ignored in production? (If you haven't had that experience, I envy you!)

This is especially frustrating when your production environment is a Docker container running in the cloud, built by a CI/CD server. You can't exactly SSH into the server and look at the code to make sure your deploy _actually worked_. I guess you could unblock that, but it seems like the wrong reason to open up SSH ports on your production containers and probably inadvisable.

Anyway, if you find yourself in this situation, here's how you can double-check what's actually inside that production container. My notes are from Amazon's AWS Elastic Container Repository (ECR) but the steps should be the same even if you're using a different service and the syntax varies.

1. Log in to ECR:

```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
```

2. Pull the image from ECR to your local machine:

```bash
docker pull <account-id>.dkr.ecr.us-east-1.amazonaws.com/my/repo/name:tagname
```

3. Start the container locally:

```bash
docker run -it --entrypoint /bin/bash <account-id>.dkr.ecr.us-east-1.amazonaws.com/my/repo/name:tagname
```

This starts the container in interactive mode and rather than launching its usual startup command, runs, in this case, `/bin/bash` to give you a shell to browse around the container.

Now you can dig around and make sure your code changes are in fact represented in the production build, where and how you expected.

What should you do if the code is what you wanted it to be and the app still doesn't work?

Well, friend... That remains one of life's great mysteries.
