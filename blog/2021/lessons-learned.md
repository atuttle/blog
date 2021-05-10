---
title: lessons learned
date: 2021-12-31
tags:
  - draft
commentsPostId: some-unique-string
---

IQ Platform first commit 6/17/2014
~18k PR's since then

- ORM stinks (srsly tho) -- just use queries
- If you're going to use ORM, you should still use a DAO to decouple DB access from the services and make your services more testable.
- ORMReload() dbcreate=none in all environments all the time; manually alter DB's as needed. Speeds up app start time. Bigger project == more important.
-
