---
title: "How you can contribute to Taffy documentation"
summary: "How you can contribute to Taffy documentation..."
date: 2012-04-13 12:57:50
tags:
  - taffy
  - git
commentsPostId: How-you-can-contribute-to-Taffy-documentation
---

I've had more than one person offer to help me with Taffy documentation lately, and I would love to be able to open it up just like the source code of the project so that people could make proposed changes and submit a pull request. Unfortunately this is [a standing request that's yet to be filled for Github Wiki's](https://github.com/gollum/gollum/issues/265).

I think I may have found a workaround.

It takes a little bit of extra effort (only a little!) and I would only recommend it for intermediate gitter's and above. (_Sorry noobs!_)

Every wiki should be available as a git repo already. For example, you can see Taffy's [here](https://github.com/atuttle/Taffy/wiki/_access), and FW/1's [here](https://github.com/seancorfield/fw1/wiki/_access).

My proposed workflow is this:

 1. Manually create a fork of the Taffy wiki on your Github account:
    * Create a new repository on your github account. Let's call it "Taffy-Wiki".
    * Clone the Taffy wiki repo to your local machine somewhere:<br/>`git clone git://github.com/atuttle/Taffy.wiki.git`
    * Remove the original "origin" remote and add your github repo as new "origin"<br/>`git remote rm origin` and<br/>`git remote add origin git://github.com/<YOUR_USERNAME>/Taffy-Wiki.git`
 2. Make your proposed changes locally, then push them to your github account:<br/>`git push -u origin master`<br/>('-u origin master' only required the first time; afterwards just do `git push`)
 3. Submit a ticket to the [official Taffy issue tracker](https://github.com/atuttle/Taffy/issues) requesting me to review your changes and merge them in. **Please be sure to include a link to your repo and describe what you've changed.**
 4. Goto #2


I apologize if that sounds complicated, but when you think about it in comparison to making code changes and submitting a pull request, it's not _that much_ more complex. Also, here's a script you can copy/paste into your terminal that will do the forking for you, except the repo creation:

    git clone git://github.com/atuttle/Taffy.wiki.git; cd Taffy.wiki; git remote rm origin; git remote add origin git://github.com/<YOUR_USERNAME>/Taffy-Wiki.git

This requires that you:

 * First create a new Github repo named "Taffy-Wiki"
 * Insert your github username for `<YOUR_USERNAME>` toward the end

This way anyone can submit documentation patches and I'll be able to review easily merge them in and keep the published wiki updated. (I had considered just putting the wiki source in to a folder or branch of the source repo, or its own repo, but that comes with its own challenges like keeping the published wiki updated.)

Thanks for your interest and contributions!
