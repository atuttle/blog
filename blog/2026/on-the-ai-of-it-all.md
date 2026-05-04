---
title: 'On the AI of it all'
desc: 'LLMs can be useful, but at what cost?'
date: 2026-05-03 08:00:00
tags:
  - ai
  - productivity
syndication:
  - https://bsky.app/profile/adamtuttle.codes/post/3mkxymlpuck2u
---

**_Every article on this website is written without AI content generation or editorial assistance._**

<!-- I am going to be using the phrase "AI" here a good bit as shorthand for LLM's mostly because of how awkward it can be to phrase things around the phrase "LLM's", but know that I don't actually believe this is big-A, big-I, "AI." -->

## I am (probably) a hypocrite

Below I will be pointing out some significant harms that AI is already doing to our natural environment and our society; and yet I continue to use it almost every day. This is marginally hypocritical of me, and I do carry guilt for that. But I'll come back to that a bit later...

## AI is useful

Agentic-coding is here to stay. Enough people have found it useful that we're never getting that toothpaste back into the tube. I am a heavy user of Claude Code and if I'm being honest, sometimes to my own detriment. It's hard to convince myself to put in 4 minutes of effort even for a simple task when I can spend 20 seconds to voice-prompt my AI to do it instead. Sometimes it saves me 2 minutes on that task, sometimes it costs me 2 extra minutes because the AI was slower, but in all cases the effort I had to expend was much lower.

We've found the bottom of a very deep gravity well. It's hard to imagine we'll ever get out of it. But where laziness used to lead engineers toward low-effort, low-cost solutions, this gravity well has a much higher invisible cost.

That's not to say AI doesn't bring significant benefits in certain scenarios. There is a huge refactor that we've been putting off at work for years, in the "it'll never happen" category, and I'm on the home stretch of completing that refactor thanks to the tireless effort and always-fresh context of a Ralph loop. (And the continued efforts for AI to code-review and fix the changes.)

Vibe-coding is fun, but that doesn't mean your auto mechanic is going to rebuild Shopify to double their profit margin. If they do, run. That's a disaster in the making. It takes a skilled developer with years of experience to go from zero to a product safe to use in public, even when using Lovable/etc. What your mechanic doesn't know about development ~~won't hurt them~~ will get your credit card information stolen, or worse. Likewise, it takes skill to guide coding agents to keep the code from turning into a ball of mud in the long term.

What about non-coding tasks?

I will try to stay in my lane, but I have found it to be very useful at summarizing information and organizing my own thoughts: I've ingested our product's entire ticket history to build [a wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) that I can query against to answer tech support questions when I don't have that knowledge in my L1 cache.

I also found it very good at organizing my thoughts and helping me find the right words for writing a thank-you note for an extremely generous gift. I didn't just let the LLM write the note and then transcribe it with pen and paper; I used it to turn my own swirling thoughts into well-written phrases that I liked, and incorporated them into my own style.

Perhaps this is coding-adjacent, but [AlphaFold](https://alphafold.com/) is inarguably good for humanity.

## The Invisible Costs

The climate was already starting to take a turn for the worse before we decided that generating pictures of corgi's in space was worth [some extra pollution](https://en.wikipedia.org/wiki/Environmental_impact_of_artificial_intelligence).

Some of that pollution is subtle and not widely well-understood.

<iframe width="560" height="315" src="https://www.youtube.com/embed/_bP80DEAbuo?si=GEAQRe-BZDftqMBl" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

And then there's mental health. As a parent, I'm scared on multiple levels. Firstly, that AI will convince my children not to seek professional help if they ever need it. But also that they currently have a distaste for it in general. As we'll come around to, I worry that it's a tool they'll need to know how to use to participate in the future workforce.

I'm not going to do a better job than John Oliver covering the frankly abhorent mental health concerns of AI:

<iframe width="560" height="315" src="https://www.youtube.com/embed/Ykvf3MunGf8?si=twGvc0E0M5rm8V_F" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## This is a bubble, right?

To extend the "technical debt" metaphor from our industry, it feels like the AI industry is piling legislative debt, on top of economic debt, on top of environmental debt, to try and be the first to reach "AGI" on the assumption that crossing the finish line magically solves all of the problems they papered over to get there. The winner takes the spoils and second place will have spent trillions of dollars for nothing. But don't concern yourself with that Senator, just remember that if you remove these regulations then I can build my datacenter in your state and create a few temporary jobs before the next election cycle.

I bought my first house less than a year before the 2008 housing market crash. "Real estate always goes up!" they said. So it feels eerily familiar when we've got chatbots letting kids kill themselves and people getting sick from simply living near datacenters.

My friend [Ben Nadel](https://www.bennadel.com/?site-photo=328) recently told me he had heard this phenomenon referred to as "Toxic Optimism;" the idea that the goal will solve all of our problems, so it doesn't matter what damage we do along the way.

## The right way to pursue A(G)I

For the sake of argument let's assume that AI is a good thing worth pursuing. Are we going about it the right way? I think not.

Competition is good for innovation, but I think that breaks down at this scale. F1 racing is interesting because the strict rules and competition drive innovation. The current [F1 budget cap](https://www.fia.com/system/files/documents/fia_2026_f1_regulations_-_section_d_financial_-_f1_teams_-_iss_06_-_2026-04-28.pdf) is $215 million per year, but in 2019 the top teams were all spending twice that: almost half a billion per year.

We're talking about multiple companies that are _each_ operating with budgets 3-4 orders of magnitude higher; each finding new and exciting ways to make the economy of at least the United States, if not broader, dependent on their success.

Instead of competing with one another, if they worked cooperatively we could theoretically achieve the same results for maybe a third of the total money spent. But it's not my money, so why do I care? Because they're doing [shady shit](https://www.msn.com/en-us/money/savingandinvesting/michael-burry-sounds-alarm-on-what-spacex-ipo-means-for-401-k-s/ar-AA221vH5) to embroil my money in their grift.

## Do we have to use the tools?

To have a long career in tech, you have to change with the times. There are still COBOL developers (probably making a pretty penny!) but there aren't many COBOL job opportunities. It's kind of a dangerous bet to make. Can you ride out the last 3rd of your career keeping legacy systems afloat on ancient tech stacks? Maybe. But what if you get laid off and can't get another job with that stack?

It advantages you to evolve with the field. AI code generation is a new tool, and when used well, can be quite powerful. Choosing to avoid it is taking a bet that the bubble will burst or the industry will revolt. It might be smart to hedge and at least maintain a minimum level of fluency.

Hence my guilt, and why I feel like a hypocrite. I am starting to realize that I don't like the morals of the path we're on, but I can't justify fully detaching either.

Is it a moral failing to use AI to write some of my code? No more than it's a moral failing to shop at Walmart because it's closer and their groceries are cheaper, so I can feed my family for less and have more money for my mortgage, heat, and the occasional vacation.

If I have a moral obligation in this scenario, it's to use my voice to fight for better working conditions and pay for Walmart workers, for more regulation on datacenters and the numerous harms they can do, and for AI companies to pay slightly more attention to social-good and less to their position in the race for AGI than they already are.
