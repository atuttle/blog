---
layout: default
eleventyExcludeFromCollections: true
discuss: false
img: /img/me.jpg
---

<link rel="preconnect" href="https://embed.podcasts.apple.com" />

## Yo! I'm Adam

![Photo of Adam Tuttle][gravatar]{class="headshot"} I make stuff on the internet, but as you can tell from... _\*gestures broadly\*_ ... I am not a designer.

I am a life-long-learner and I believe that sharing what you learn is a great way to crystalize the lessons for yourself, so I write about things I learn here. I fancy myself a decent writer, and have decided to inconvenience _these specific electrons_ to prop up that fantasy.

My passion for learning drives me to dabble in many hobbies. In addition to tech, my other interests including skydiving, woodworking, and podcasting.<br/>[For the curious, I've obliged with some detail about myself here](/blog/2021/about-me/).

### Recently Inconvenienced Electrons

Most recently I wrote {% for recent in collections.blogLatest %}<a href="{{ recent.url }}">{{ recent.data.title }}</a>. {{recent.data.desc}} {% endfor %}

I also have a [full index of all {{collections.blog.length}} articles][index], or you can [browse by tag](/tags/).

[index]: /blog

### Working Code Podcast

I created and co-host the [Working Code Podcast][wcp], a language-agnostic web-development focused podcast with the goal of celebrating the triumphs and fails of a career in software, and making your coding career more enjoyable. We publish new episodes every Wednesday.

<iframe allow="autoplay *; encrypted-media *; fullscreen *" frameborder="0" height="450" style="width:100%;max-width:660px;overflow:hidden;background:transparent;" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" src="https://embed.podcasts.apple.com/us/podcast/working-code/id1544142288"></iframe>

### Let's Stay In Touch

A few times each year I send out some emails. It's something I usually reserve for when I'm doing something big, like when I started the podcast or when I [made my book available in paperback](https://restassuredbook.com). I work hard to make the emails worth getting (like discounts on stuff I sell), I never sell or share your contact details, and you can unsubscribe at any time.

<script async data-uid="02c5dc9bec" src="https://adam-tuttle.ck.page/02c5dc9bec/index.js"></script>

[wcp]: https://workingcode.dev
[gravatar]: https://www.gravatar.com/avatar/c9e260373387e72ce020928a3a546ec5?rating=G&size=200&default=mm
[garden]: /blog/digital-garden
