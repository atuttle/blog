---
layout: default
eleventyExcludeFromCollections: true
discuss: false
---

# Yo! I'm Adam

![Photo of Adam Tuttle][gravatar]{class="headshot"} I make stuff on the internet, but as you can tell from... _\*gestures broadly\*_ ... I am not a designer.

You've found yourself at the root node of my [digital garden](/notes). I am a life-long-learner and I believe that sharing what you learn is a great way to crystalize the lessons for yourself, so I write about my learnings here. I fancy myself a decent writer, and these electrons are being terribly inconvenienced to prop up that fantasy.

In addition to tech, I have a variety of other interests including skydiving, woodworking, and podcasting. Want some more details? [I've obliged with some detail about myself here](/notes/2021/about-me/).

The last 3 things I've written:

<ul>
{%- for page in collections.recent -%}
<li><a href="{{ page.url }}">{{page.data.title}}</a></li>
{%- endfor -%}
</ul>

[![My Twitter account](/assets/icons8-twitter-50.png)][twitter]
[![My GitHub account](/assets/icons8-github-50.png)][github]
[![My TikTok account](/assets/icons8-tiktok-50.png)][tiktok]
[![My YouTube account](/assets/icons8-youtube-49.png)][youtube]
[![My Instagram account](/assets/icons8-instagram-old-50.png)][instagram]

### Digital Garden TODO list:

1. ~~redirects from old blog urls~~
1. ~~display most recent entries on homepage~~
1. ~~make sure twitter discussion, edit on github, and contrib links are working~~
1. searchable db of entries
1. make sure social image embeds (and other open-graph tags) are working correctly
1. copy over all current blog content
1. work on restoring more ancient blog content
1. submit a PR to the digital garden repo with the notes-subfolders-backlinks fix
1. embed a playlist of recent podcast episodes (not sure how easy this will be)

[gravatar]: https://www.gravatar.com/avatar/c9e260373387e72ce020928a3a546ec5?rating=G&size=200&default=mm
[garden]: /notes/digital-garden
[twitter]: https://twitter.com/adamtuttle
[github]: https://github.com/atuttle
[tiktok]: https://tiktok.com/@planespooppeople
[youtube]: https://www.youtube.com/c/AdamTuttle/videos
[instagram]: https://www.instagram.com/alteregowoodworks/
