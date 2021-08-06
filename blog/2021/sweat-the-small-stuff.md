---
title: Sweat the Small Stuff
date: 2021-05-12
tags:
  - clean code
  - best practices
commentsPostId: sweat-the-small-stuff
---

For years now we've been lecturing each other that the arguments over tabs vs. spaces and other such trivial details are meaningless bikeshedding and that we should put that behind us and get to work. In some ways I agree. In some I disagree.

![tabs rule, spaces drool. change my mind.](/img/2021/tabs-rule.jpg)

Having [recently read Clean Code by Robert Martin](https://workingcode.dev/episodes/022-book-club-1-clean-code-by-uncle-bob-martin-pt1/), I find myself more put off by trivially-unclean code in a code review than I was previously. Not that I am upset with my teammates for imperfect code&mdash;far from it!

But.

Imagine the codebase _is perfect_. I know, I know. Suspend your disbelief for a moment. Now, you're doing a code review and the file is consistently indented with tabs but the changed line is indented with spaces. Functionally, the change is flawless. Do you reject the pull request and ask the developer to change it? _It's just one line!_

You could approve the PR and merge it with the intention of coming back to clean it up "some day" but as we all know, "some day" is the same thing as "never."

Now multiply that by every pull request. Over 10 years. 20. Not just tabs-vs-spaces indentation, but other little inconsistencies, too. HTML closing tags that don't get indented to the same level as their opening tag. Lazy variable names. Outdated comments. And so on. Now remember that the code wasn't perfect to begin with.

This project is now a mess and **harder to work on**.

I'm not going to go through every code review with a fine-tooth comb and make sure everybody's opening and closing HTML tags are indented to matching levels, but if I notice a problem then I'm going to reject it.

For some languages, things like linters and code formatters can help automate this work for you. **Use them!** And for the love of everything holy... Turn on whitespace characters in your editor so that you can spot the inconsistencies before you submit your code review!

Here's how you find the setting in VS Code:

![How to turn on whitespace characters in VS Code: Search for "render whitespace"](/img/2021/how-to-find-whitespace-chars.png)

And here's what your editor could look like with the setting enabled:

![What whitespace characters look like in VS Code](/img/2021/having-whitespace-characters-enabled.png)

Sweating the small stuff today is an investment in reducing future stress for yourself, your team, and the countless developers that will inherit your code after you're long gone.

Sweat the small stuff.
