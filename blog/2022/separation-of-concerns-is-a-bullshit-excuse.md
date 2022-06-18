---
title: Separation Of Concerns Is A Bullshit Excuse
desc: An argument that separation of concerns should _encourage_ the approach that React and Svelte enable for modularity, rather than disqualify them.
img: /img/2022/distracted-boyfriend-meme.jpg
date: 2022-09-20
tags:
  - react
  - svelte
  - clean code
---

![Distracted boyfriend meme: He has a label over his torso that reads, "Separation of concerns" and he is looking longingly at a woman whose torso has a label that reads, "single file components" while his girlfriend watches him with an insulted look on her face and a label over her torso that reads, "files split by syntax"](/img/2022/distracted-boyfriend-meme.jpg)

Even now &ndash; in the 2nd half of 2022 &ndash; I still see a lot of casual dismissal of React as a crazy idea that some people will never consider.[^1] Their chief complaint seems to be about [separation of concerns][1] ("SoC"), the idea that things should be modular, and self-contained, with clearly defined boundaries.

[^1]: It's usually couched inside of statements like "it's not for me" but the comments about how terrible JSX "is" are never far behind. We haven't even gotten to the part about CSS-in-JS! Mostly I see it from Angular and Vue fans. And I suppose it's only fair to state up front that I haven't touched Angular since around the 1.2 days, and aside from browsing its website for a few minutes to satisfy my curiosity I've never worked with Vue.

## The Wrong Interpretation Of Separation Of Concerns

The very idea of [JSX][2], with its angle-brackets reminiscant of HTML, intermingling with their JavaScript makes some people's heads spin. Never mind that it's all JavaScript with a DSL to simplify expressing your thoughts into UI and actions. The angle brackets go in one file, and the semicolons in another, _and never the 'twain shall meet!_

This was the exact thing that made many eyebrows raise without their partners when React was first shared with the public in 2013. It's been 9 years. If that argument was valid it would have prevented React's ascension by now.

**Insisting on segregating your code by syntax is the coding equivalent of alphabetizing the contents of your pantry.** You don't put the cooking oil with the chocolate because they both start with the letter C.

It's understandable that we find ourselves here. Separation of concerns is a good idea; we just didn't have great tools to achieve it for the web until recently. When your only tool is a hammer, everything looks like a nail. The only way we had to separate concerns previously was by putting them in separate files segregated by syntax.

That's not entirely true. [SHTML][4] was a thing, but it clearly lost that battle. It was ahead of its time.

So put down the hammer for a minute and let's chat.

## Separation Of Concerns Remains Correct

I argue that separation of concerns should _encourage_ the approach that React and Svelte enable for modularity.

When I was in my early teens my dad got me a copy of **Visual Basic in 21 days**, and that's where my love for programming truly blossomed. And even way back then, they got separation of concerns right. This was circa VB4, probably around 1996 &ndash; the infancy of JavaScript. In Visual Basic you would design a window of your application (a "view" if you will), and then you could toggle over to the logic portion of that window and write the code that would handle each button press, etc.[^2] Each window's logic was separated from each other. Why would you have code to handle click events on one window mixed in with code to handle click events from another? It just doesn't make sense.

[^2]: If it was capable of the layers of abstraction available to us these days, where even a simple button can be a separate file, then I don't recall that level of granularity. It's been a few years.

SoC is about increasing cohesion and decreasing coupling. Consider two examples:

1. Organized by syntax
   - HTML in HTML view-templates
   - JavaScript in separate JS files
   - CSS in separate CSS files
2. Organized by functionality
   - For each discrete chunk of functionality, there is a single file that contains the logic, the view, and the presentation/styling.

For just a moment, set aside your concerns about having a single file containing 3 different syntaxes. Just because you've seen some terrible single-file websites doesn't mean that all intermingling of syntax is categorically bad. For the purposes of this line of questioning, assume that it can be done cleanly.

### Which Is More Cohesive?

Cohesion is a measure of how related a group of things is.

You can either open up the shopping cart view file and find the JS file(s) it includes to open those, and then head over to your monolithic CSS and try to figure out which parts of it apply (don't forget about the cascade!)...

Or you can open the single file that handles the shopping cart view and know that it contains everything you'll need, possibly descending layers of abstraction as needed.

Grouping all of the JS together because it's all JS is the alphabetized pantry. Sure, it's "organized" but does it serve its purpose of helping you prepare food well? Does it reduce the time it takes you to find the bug? Is it easier to [keep everything in your head while refactoring][5]?

What is the thing we do most with code?

We read it, in an attempt to understand it; in order to debug, extend, or refactor it.

Now, which of those examples would be easier to read and understand? If it's all in one file, you know for a fact that you don't have to hunt down dependencies or worry that something else might be affecting the relevant state of your application without you realizing it.

### Which Is More Decoupled?

A file with no dependencies is maximally decoupled. The only way it could get less coupled would be to not exist. Granted, complexity exists, which is why we invented abstraction.

But don't confuse abstraction for tight coupling. The shopping cart view can contain shopping cart items, but it doesn't need to know anything about them to do its job. "Can contain" is just about the loosest of couplings I can imagine.

A single-file component doesn't mandate that you can't abstract bits of complexity or reusable components out into other files. It means that everything relevant to _this_ component is in _this_ file. The `ShoppingCart` component has a Proceed to Checkout button and might disable it if there are no items in your cart, but also makes use of the `ShoppingCartItem` component, because the complexity involved in displaying individual cart items is better encapsulated away from things that aren't concerned with displaying individual cart items.

Or in other words, the cleaner[^3] you make your code, the easier it is to work with single-file components.

[^3]: This is a reference to Robert Martin's book, "Clean Code" which I haven't written about specifically. I would have linked it to the relevant episodes of my podcast, but that was before we really figured out what the podcast should feel like, and as a result I'm less proud of those episodes.

## It's About Clean Code

It is possible to write bad code in any language, framework, or methodology. Any single 5,000+ line sourcecode file is categorically ~~bad~~ in need of improvement. But that doesn't mean that the organizational system of keeping different varieties of cheese together in the cheese drawer is a bad thing.

And who among us hasn't worked on a 5,000 line file of CSS and hated it? There's no way to know what's safe to delete and what must be kept. It's impossible to predict what weird affects the cascade will cause -- because it's impossible to unpack the entire file into your working memory.

I think that if you gave single-file components a _real_ chance, and tried to separate your hatred of files that are in desparate need of refactoring and abstraction, you'll find that this is the better way to go.

[1]: https://en.wikipedia.org/wiki/Separation_of_concerns
[2]: https://reactjs.org/docs/introducing-jsx.html
[4]: https://stackoverflow.com/questions/519619/what-is-the-purpose-and-uniqueness-shtml
[5]: https://heeris.id.au/2013/this-is-why-you-shouldnt-interrupt-a-programmer/
