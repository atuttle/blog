---
title: Debugging Docker Health Checks
date: 2021-11-18
img: /img/2021/barrett-ward-5WQJ_ejZ7y8-unsplash.jpg
tags:
  - docker
---

![Shipping containers in a busy port](/img/2021/barrett-ward-5WQJ_ejZ7y8-unsplash.jpg)

Photo by <a href="https://unsplash.com/@barrettward?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Barrett Ward</a> on <a href="https://unsplash.com/s/photos/container?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>{class="photo-byline"}

For what I hope are obvious reasons (deploys, fail-over, etc), docker health checks are important.

Unfortunately they're also a bit of a black box. You write some code to report back whether or not it's healthy, and docker will call that code to determine if the container is healthy, but it's not obvious how to see the results of that code. When a container is being reported as unhealthy, it can be maddening to try and figure out why. Here are some techniques I've found over the years to make debugging them so much less frustrating.

## Debugging Local Containers

What is the current health status of a container?

```bash
docker inspect --format "{{ "{{json .State.Health.Status }}" }}" container_name
```

Let's assume your container is unhealthy. How can you get more detail than that? Firstly, since we're working with JSON on the CLI, I recommend you install [jq][] (osx homebrew users can run `brew install jq`).

[jq]: https://stedolan.github.io/jq/

```bash
docker inspect --format "{{ "{{json .State.Health }}" }}" iq_platform_jsconfig_mt | jq
```

Just in case you were thinking about not using `jq`, here's the difference in output of the previous command, without and then with jq:

![Terminal screen shot showing the difference between the two commands](/img/2021/docker-healthcheck-debug-1.png)

## In The Cloud

The only cloud service I have experience with is AWS, so that's the only one I can provide this advice for. Feel free to share the equivalent for Google Cloud, Azure, etc.

Unfortunately AWS doesn't expose the full healthcheck log through their CLI, but you can at least get some sense for it using this command.

```bash
aws ecs describe-tasks --cluster platform-jsconfig-mt  --tasks <task-id> | jq '.tasks[0].containers[0]'
```

Of course this requires you to know the task id (at present, this is a 32 character alphanumeric string), which I imagine you can extract using other aws cli commands if needed -- that's out of scope for this discussion.

This returns some useful information but nowhere near the same level of detail as we got for local containers.

![Terminal screen shot showing output of the aws ecs describe-tasks call](/img/2021/docker-healthcheck-debug-2.png)

To be perfectly honest, I'm sure most of what I obscured in the above screen shot is benign, but as it's from our production environment and I'm not in a risk-taking mood, better safe than sorry, right?
