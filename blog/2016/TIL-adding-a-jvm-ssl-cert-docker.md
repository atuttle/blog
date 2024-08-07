---
title: 'TIL: Adding an SSL Cert to the JVM Inside a Docker Image'
desc: "Adam's been playing with Docker and had some trouble figuring out a cert issue, so he's blogging the solution for future googlers."
img: /img/2016/possessed-photography-0La7MwJhSyo-unsplash.jpg
date: 2016-06-27
tags:
  - docker
---

I've been playing with Docker lately for a bunch of reasons, but topping that list is that it's everything I ever wanted out of Vagrant, and then some. (And what better thing to do on a camping trip after the kids are tucked into bed?) In some ways, the Dockerfile syntax is what I wish the Vagrantfile syntax was (shell script instead of Ruby). Anyway, here's a solution to an interesting problem I ran into today.

I need to make HTTP requests to the [mailgun][mailgun] API and their certificate isn't valid given the JVM cert store that I'm inheriting in my Docker image. Of course, I just need to [download and import the certificate][cert]<sup>\[1\]</sup>, but it took me a little while to wrap my mind around the idiomatic Docker way of doing this.

After some hints from [Ryan][rg] (to whom I owe cases and cases of beer for similarly helpful advice), and a little more googling and trial and error, this is what I came up with. In my Dockerfile, I've added:

```docker
COPY ./res/mailgun.net.crt /opt/lucee/
ENV LUCEE_CACERTS /opt/lucee/server/lucee-server/context/security/cacerts
RUN keytool -noprompt -storepass password_here -import -alias mailgun -keystore ${LUCEE_CACERTS} -file /opt/lucee/mailgun.net.crt
```

After copying my downloaded mailgun certificate file into the Docker image, I use the `keytool` command with options `-noprompt -storepass` to import it without prompting me for the store password.

As a refresher, to find all `cacerts` files on your (linux) machine, try this:

```bash
$ find / -iname 'cacerts'
```

This will list all files named cacerts on the system. In my Docker image, there were 4. I picked the one associated with [Lucee][lucee] because that's the app server I'm working with in this case, but it's possible that importing to the JVM's store could have worked too. I just got lucky on my first guess, so I stopped there.

---

<small>
	1: On OSX I was able to download the certificate with Firefox following{' '}
	<a href="http://stackoverflow.com/a/36427118/751">these instructions</a>, and
	while I did select the "der" export type, it saved as a .crt file. Java did
	not complain about importing this file.
</small>

[mailgun]: https://mailgun.com/app/dashboard
[lucee]: http://lucee.org/
[rg]: http://ryanguill.com/
[cert]: http://stackoverflow.com/a/36427118/751
