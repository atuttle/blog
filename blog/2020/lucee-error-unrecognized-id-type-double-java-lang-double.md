---
title: 'Lucee error: unrecognized id type : double -> java.lang.Double'
desc: "Today's adventure in the ways in which ORM in Lucee is <em>a little off</em> got started when I tried to use ORM to create a new record."
img: /img/2020/
date: 2020-02-27
tags:
  - lucee
  - orm
---

Today's adventure in the ways in which ORM in Lucee is _a little off_ got started when I tried to use ORM to create a new record. That entity uses an identity column as its primary key.

```js
property;
name = 'accountId';
type = 'numeric';
fieldtype = 'id';
generator = 'identity';
```

The problem only reared its head when attempting to insert a new row into this table using ORM.

![Screen shot of error message, "unrecognized id type : double -> java.lang.Double"](/img/2020/lucee-identity-col-error.png)

unrecognized id type : double -> java.lang.Double{class="photo-byline"}

Fortunately, when I mentioned this at our daily standup meeting, a coworker remembered that he had run into this in the past. I imagine that he found a fix at the time by googling and finding an answer in a discussion group or something, so I'm glad to have had him to help me! The fix isn't obvious! See if you can spot it:

```js
property;
name = 'accountId';
type = 'numeric';
fieldtype = 'id';
ormtype = 'integer';
generator = 'identity';
```

The fix was adding the attribute `ormtype="integer"`. I'm told that `ormtype="int"` -- while [technically valid](https://cfdocs.org/cfproperty) -- won't fix it. I tried it in one location and didn't have any problems, but I figured it was worth mentioning, you know, just in case.

While we're here, can we take a moment to acknowledge how strange it is to have an attribute named `ormType` that exists specifically for use with the primary key? The name seems general enough to be applicable to any column. But right [from the ACF docs](https://helpx.adobe.com/coldfusion/developing-applications/coldfusion-orm/define-orm-mapping/map-the-properties.html):

> Used to specify the data type of the primary key. If data type is not set and the ORM setting useDBForMapping=true, then the ormtype is determined by inspecting the database. The different data types that are supported by ColdFusion are specified in the ORM data types.

I can't find any docs on `ormType` in the Lucee docs, which is ironic considering that this attribute wasn't necessary in our code on ACF but is necessary on Lucee.
