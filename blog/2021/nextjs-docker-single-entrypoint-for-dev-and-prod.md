---
title: Next.js Docker Single Entrypoint for Dev and Prod
summary: Using npm scripts to make an env-aware startup command
img: https://adamtuttle.codes/img/2021/split.jpg
date: 2021-07-06
tags:
  - docker
  - npm
  - javascript
commentsPostId: nextjs-docker-single-entrypoint-for-dev-and-prod
---

Maybe I shouldn't be as excited about this as I am, but I love it when simple things do smart things.

I'm currently working on a Next.js application, which will be deployed in a Docker container on AWS Fargate. When you generate a new Next.js application, you get these scripts in your `package.json` to start:

```json
"scripts": {
	"dev": "next dev",
	"build": "next build",
	"start": "next start",
	"lint": "next lint"
},
```

As you might expect, you use `npm run dev` to start a local development instance, which is not optimized for production (it assumes you're making lots of changes and is more eager to recompile stuff, basically). In production, you _should_ be starting the application with `npm run start`. This assumes that you've already created a production-optimized build with `npm run build`, which can make assumptions like you're not going to be changing things, so it should pre-compile as much as possible.

So, your typical Dockerfile for a Next.js application should resemble this:

```dockerfile
FROM node:14 as Builder
WORKDIR /usr/src/app
COPY . /usr/src/app
ENV NODE_ENV=production
RUN npm ci

FROM node:14.17.1-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app /usr/src/app
RUN npm run build
CMD npm run start
```

This is all pretty standard stuff. We're using a multi-stage build to minimize final container size, and creating a production build. (For what it's worth, I initially had the `npm run build` step in the first stage, but the build artifacts weren't found when running `npm run start` in the final container, even with the full app directory copy. 🤷‍♂️)

This is where it gets interesting.

I've written in the past about [my love of Makefiles][makefiles]. So now let's assume I have a Makefile with the following target, which I use to start my container for local development.

```makefile
dev-up: .built
	docker run --rm -d --name widgets-dev \
	-p 3000:3000 \
	-v `pwd`:/usr/src/app \
	--env NODE_ENV=development \
	myco/widgets:dev
```

This starts the container with the name `widgets-dev`, mapping host port 3000 to container port 3000, NODE_ENV set to development, **and crucially, a volume of the current working directory mounted as `/usr/src/app`**.

Initially I expected this to _just work_. Since the working directory is mounted inside the container at the application source directory, fast refresh and all of the usual development-environment goodies should still work out of the box, right?

Well, can you see what's missing? Yes, we're properly overriding the `NODE_ENV` value when we start the container for development, but the container has only one `CMD` entrypoint, and we want it to do different things depending on its current environment variables. In dev it should run `npm run dev`, but in production or qa it should run `npm run start`.

I found an easy and simple way to accomplish this with npm scripts, but it's not perfect...

```json/3
"scripts": {
	"dev": "next dev",
	"build": "next build",
	"prestart": "node -e 'process.env.NODE_ENV === \"production\" || process.exit(1);' || npm run dev",
	"start": "next start",
	"lint": "next lint"
},
```

Here I've added a script named `prestart` which [npm will execute before it runs the `start` script][npmscripts]. My `prestart` script uses the inline-evaluation feature of node.js (`-e`) to check the current value of `NODE_ENV` and if it's anything other than `production` the inline script exits with error code 1. After the inline script I have `|| npm run dev` which will execute the `npm run dev` only if the previous command exited with an error code.

This is working reasonably well for me right now. The container always runs `npm run start` as its entrypoint, and it runs in dev mode in the dev environment, or production mode in the production environment.

Here's where it's not perfect:

In local development, when the dev server shuts down, npm has been waiting to spring into action and it follows suit by trying to execute `npm run start`. Remember that the dev server has been running as part of `npm run prestart` this entire time. I'm not sure yet if there's a way to stop this from happening, and to be fair it's _not a big deal_ because the error happens inside the docker container which hides it from view.

I know that I can make the `npm run dev` portion of `prestart` exit with a nonzero code and that this would stop npm from running the `start` script, but it does then return an error:

```json
"prestart": "node -e 'process.env.NODE_ENV === \"production\" || process.exit(1);' || (npm run dev && exit 1)"
```

I'm not sure if that's trading one bad thing for another, nor whether or not it's a good trade to make.


[makefiles]: https://adamtuttle.codes/blog/2021/my-ongoing-love-affair-with-gnu-make/
[npmscripts]: https://docs.npmjs.com/cli/v6/using-npm/scripts#pre--post-scripts
