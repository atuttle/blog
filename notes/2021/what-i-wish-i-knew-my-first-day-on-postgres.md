---
title: What I Wish I Knew for My First Day on PostgreSQL
date: 2021-09-20
summary: 'Everything I had to research on my first day using Postgres, coming from MySQL'
img: https://adamtuttle.codes/img/2021/andrew-rice-xYO4F6HoxOQ-unsplash.jpg
tags:
  - postgresql
commentsPostId: my-first-day-on-postgres
---

![An elephant sprays itself with mud](/img/2021/andrew-rice-xYO4F6HoxOQ-unsplash.jpg)
_Photo by [Andrew Rice](https://unsplash.com/@andrewricegolf?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/elephant?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)_

I have only just started using PostgreSQL for a new application; and I'm coming from a MySQL background. That affords me a pretty nifty advantage: _The eye of the newbie!_ So I thought I would share the things that were important to me as I begin my PGSQL journey, in hopes that they can save you some time as you start yours.

### Choosing a GUI

There's lots of choices for a GUI. I'm not here to shill for any of them. Since this is all new to me I'm not looking to make any big investments right now so I'm sticking to the free tools. I've heard recommendations for both [DBeaver][] and [Postico][], and I also stumbled on [pgAdmin][]. I started with DBeaver based on a recommendation from a coworker, but so far I'm finding more that I dislike about it than I like.

### Primary Key Data Type

Coming from MySQL where the norm is to use the `int` type with an `auto_increment` flag for your primary key (which generates auto-incrementing numeric value for you at each new insert), the first real question I had was how to do the same in PG. A quick google told me to use the `serial` type (there's also `big serial` if you need it), which does basically the same thing.

While we're on types, here are a few other conversions as I currently understand them:

- `varchar(42)` 👉 `character varying(42)`
- `char(2)` 👉 `character(2)`

### Time Zones

My company's customers are spread across many different time zones, so yes, [we get to live in that hell][tzhell]. But we've found some approaches that work well for us, largely depending on storing dates in UTC in the database and using its TZ functions to do conversions as needed. I haven't got this 100% worked out yet but I'm sure that [this page of the documentation][pgtz] covers the basics pretty well.

tl;dr: (at least as far as I understand yet) **don't** use `time with time zone` instead preferring `timestamp with time zone`. If time zones are at all important to you (and they probably are) then use the `... with time zone` column types everywhere.

### Case Sensitivity Is a Whole Thing

Look, there's work-arounds. But it's a frustrating struggle-bus and imho not worth fighting. Make everything lower case (use `snake_case_column_names` if you must get that visual separation). For the other benefits like Common Table Expressions ("CTE's") and the JSON support, this is a small price to pay. And it probably hurts me as much as it could hurt anyone, because I've been a lifelong devotee to `camelCaseColumnNames` and that muscle memory isn't going to rewrite itself easily.

[dbeaver]: https://dbeaver.io/
[postico]: https://eggerapps.at/postico/
[pgadmin]: https://www.pgadmin.org/
[tzhell]: https://www.youtube.com/watch?v=-5wpm-gesOY
[pgtz]: https://www.postgresql.org/docs/13/datatype-datetime.html#DATATYPE-TIMEZONES
