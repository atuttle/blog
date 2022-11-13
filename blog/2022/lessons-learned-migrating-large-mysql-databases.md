---
title: 'Lessons learned from migrating large MySQL databases'
desc: 'Some lessons have to be learned the hard way.'
img: /img/2022/chris-briggs-V72Hk6LjjjI-unsplash.jpg
date: 2022-11-14
tags:
  - mysql
---

![Sandhill Cranes against a cloudy sky](/img/2022/chris-briggs-V72Hk6LjjjI-unsplash.jpg)
Photo by <a href="https://unsplash.com/@cgbriggs19?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Chris Briggs</a> on <a href="https://unsplash.com/s/photos/migration?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>{class="photo-byline"}

My team and I migrated 13 customer databases from MySQL 5.x to 8.x last week. It was hell.

Most crimes of database inefficiency can fly under the radar if your database is small enough.

My databases weren't small enough.

For reference, our largest tables were &gt; 100gb but &lt; 150gb.

I work for a startup, on a small team where every team member wears every hat. We're all the DBA and the Architect and the Code Monkey and the Project Manager and the Helpdesk and the DevOps and the Site Reliability Engineers. I'm sure that most or all of what I'm about to describe is already well known by people who specialize in databases, or even people in similar roles to me who have more experience.

Sometimes you have to learn the hard way by fighting the process until 3am and figuring it out from first principles and lots of web searches.

## Lesson #1: Import data with constraints disabled

All of these lessons require careful thought, but this one especially so.

```sql
set foreign_key_checks = 0;
/* import data here */;
set foreign_key_checks = 1
```

This allows you to import the data in whatever order makes the most sense to you, even if it violates referential integrity, without losing any of it. It's also faster because it doesn't have to check foreign keys for every row being inserted.

_You're disabling guard rails that keep you safe, so you have to take extra care to know exactly what you're doing_, but this can be really helpful, because of the speed boost.

In some cases we saw a 6gb file import take as little as 7 minutes.

## Lesson #2: Add multiple indexes with a single alter

**Naive:**

```sql
create index ixFoo using btree on Fubar(foo);
create index ixBar using btree on Fubar(bar);
create index ixBaz using btree on Fubar(baz);
```

**Better:**

```sql
alter table Fubar
	add key 'ixFoo' ('foo'),
	add key 'ixBar' ('bar'),
	add key 'ixBaz' ('baz');
```

**Why it's better:**

When you add an index to a table, the entire table is copied to a temp table, your alteration is made, and then the temp table is hot-swapped in to replace the original.

```sql
/* how a table hot swap works, hypothetically */
begin transaction;
drop table Fubar;
rename table tmpFubar to Fubar;
commit;
```

Now imagine your table is hundreds of gigabytes, with a bunch of indexes. In the naive approach, for each index being added, the table has to be copied, altered, and renamed. For the better approach, the table is copied only once.

## Lesson #3: Split the work up to use the best tool for the data you need to move

`mysqldump` is great, but not the best approach when you've got a bunch of tables that are hundreds of gigabytes each that need to be moved. Since we're on AWS, and our MySQL databases are actually [Aurora MySQL][aurora], we were able to use some special syntax to [export data to CSV's on S3][export] and then [load it back into MySQL][import] on the new instance.

[aurora]: https://aws.amazon.com/rds/aurora/
[export]: https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/AuroraMySQL.Integrating.SaveIntoS3.html
[import]: https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/AuroraMySQL.Integrating.LoadFromS3.html

We also heavily used `mysqldump` to handle the migration of smaller tables. That's why this lesson is labeled "split the work up;" because sometimes it makes sense to use `mysqldump` and sometimes it doesn't. Anything under 1gb we especially didn't even consider worth ... considering. But for those really big tables, here's how we exported them to S3 and then into the new database server:

```sql
select * from Fubar into outfile s3 's3-us-east-1://bucket-name/Fubar.csv'
fields terminated by ','
optionally enclosed by '"'
escaped by "\\"
lines terminated by '\n'
overwrite on
```

This generates CSV files, and automatically splits them at 6GB increments, which makes for easy transfer between servers, and easy import using `load data from s3`:

```sql
load data from s3 's3-us-east-1://bucket/fubar.csv.part_00000'
replace into table Fubar
fields terminated by ','
optionally enclosed by '"'
escaped by '\\'
lines terminated by '\n'
(
	@col1
	, @col2
)
set
	col1 = nullif(@col1, '')
	, col2 = nullif(@col2, '')
;
```

_Repeat the `load data` step for each 6gb chunk, e.g. `.part_00001`, `.part_00002`, etc._

The approach described above is great for moving really large tables to a new db server instance. You wouldn't want to do this for all tables, unless they're all really large, because it adds a bunch of manual steps. When you do it this way, you have to create the tables manually and you'll want to wait until the data is inserted before adding the indexes so that the indexes don't have to be updated for every record you insert.

But this approach is better than using `mysqldump` for large tables specifically because it allows you to import the data before the indexes are added. I bet there are arguments to `mysqldump` to make it not create indexes or to affect when it adds them, but by default it includes them in the `create table` statements.

This approach also gives you the opportunity to:

1. import only a subset of the data (in our case, the most recent data)
2. add the indexes
3. bring the application back online so that users can continue working, and then
4. allow the rest of the data to restore over time, albeit more slowly because of the constant index rebuilding.

This is what we ended up doing.

After waiting for _more than 6 hours_ for 5 indexes to be added to a single table after importing its entire history, we stumbled our way into the idea of importing only the most recent data for each table, then adding the indexes. This allowed our app to run in a slightly degraded state, but it was online. Then we queued up the rest of the imports (`load data from s3`) and went to bed. When I woke up in the morning, I checked in on it and the data loads were complete.

This approach also requires some special care.

Our tables use `auto_increment` primary keys. When we created the tables, we knew what the maximum PK values were, and we added a generous buffer to the `auto_increment` start value that would be used for newly inserted records. Is this strictly necessary? Probably not. But it was a healthy conservative approach.

If the `fubar` table had a maximum PK value of `155,834,091` then we set the `auto_increment` to `200,000,000`

```sql
create table `fubar` (
  /* ... */
) engine=innodb auto_increment=200000000;
```

This ensures that all new inserts that happen while the application is running have PK values that won't conflict with rows that we still need to import.
