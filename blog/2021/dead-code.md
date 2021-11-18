---
title: Dead Code
desc: My thoughts on breaking rules
date: 2021-04-21
img: /img/2021/malcolm-lightbody-4hhEvTB45vg-unsplash.jpg
tags:
  - clean code
  - best practices
---

If you didn't already know, I have a podcast ([Working Code][podcast]), and for an upcoming episode we're all reading [Clean Code: A Handbook of Agile Software Craftsmanship][clean-code] by Robert ("Uncle Bob") Martin. That's important context for what follows, because it is having a profound effect on how I am thinking about my output right now.

I won't be sharing my thoughts on the book here (for that, listen to episode 22 which will publish on May 12th), but one of the suggestions (heh) of the book is that, to summarize, **commented blocks of code are evil**; and it is that concept that I want to explore today.

In general, I would tend to agree; and I've given the same advice plenty of times over the years. But I want to explore some commented code from one of my modules that continues to survive today and, I think, for good reason.

## A Problem With Many Possible Solutions

Suppose that you need to compare some arrays and find only the items that appear in all of the input arrays. In the venn diagram, it's the intersection of all circles. Each item is a string of up to 100 characters. Now suppose that each array holds somewhere between 0 and 500,000 rows; and that you have somewhere between 2 and 100 of these arrays. The goal is to perform this calculation as fast as possible. That was my assignment.

Actually, I had the luxury that originally we didn't anticipate the number of arrays being so large, nor the number of items in each array; so my original implementation was naive because the requirements were naive -- but it worked.

```js
private array function arrayIntersectionByCounting( required array inputArrays ){
	var hashtable = {};
	var numberOfInputs = arrayLen( arguments.inputArrays );
	var intersectionResults = [];
	//count instances of each array value
	for (var currentArray in arguments.inputArrays){
		//if any array is empty, the result will be an empty array,
		//so just short-circuit the whole process
		if (arrayLen(currentArray) == 0){
			return [];
		}
		for (var i in currentArray){
			if (!structKeyExists(hashtable,i)){
				hashtable[i] = 1;
			}else{
				hashtable[i]++;
			}
		}
	}
	//make a new array of values that appear the minimum number of times
	for (var k in hashtable){
		if (hashtable[k] == numberOfInputs){
			arrayAppend(intersectionResults, k);
		}
	}
	return intersectionResults;
}
```

This implementation uses the tools at our disposal: the language native data structures and simple but efficient looping. It outputs the correct results, but once the system started to grow and the input arrays became longer and more numerous, the runtime for calculations grew to unacceptable lengths. So additional approaches were tried.

I won't go into the details of each, but suffice it to say, we racked our brains and tried really hard to squeeze every ounce of performance out of this stone.

- **arrayIntersectionByCFMLHashtable**: sorts the input arrays by length and then compares the shortest with the next shortest, returning only the items that exist in both; then repeat with the result of the previous iteration and the next-shortest array until complete.
- **arrayIntersectionByJavaHashset**: Maybe dropping down to the Java layer can help us?
- **arrayIntersectionByJavaRetainAll**: What about Java's `array.retainAll()` method?
- **arrayIntersectionByReference**: Passing arrays in CFML is done by value, which uses more memory and one would assume, extra time to make the copies. In an attempt to minimize memory usage and speed things up, this implementation wrapped every array in a structure (for the non-CFML folks: a Hashmap or an Object) because that would be passed by reference instead. Similar to arrayIntersectionByCFMLHashtable, but different. The algorithm it used was to find the shortest input array and then search for each of its items in all of the other arrays. Whenever an item was not found in an array, immediately move on to the next item. This one should be pretty performant at least in terms of Big-O notation, but still wasn't good enough.
- **arrayIntersectionBySQL**: Pump all of the data into temp tables in the database and let SQL do the heavy lifting via an inner-join.
- **arrayIntersectionByQueryOfQueries**: a CFML feature for in-memory data manipulation using its native Query data type. Kind of a long shot.

Each of these had their merits, but ultimately I found something that beat them all. It's been years so I don't recall the exact numbers of how one method performed in comparison to the others, but ultimately what we ended up going with was `arrayIntersectionByRedis`. This solution was similar in concept to the SQL attempt, but instead of letting MySQL do the heavy lifting, we let Redis do it. Redis has a data structure called a **set** and the command [sinter][sinter] performs an intersection of N sets. Through some form of arcane wizardry, it's surprisingly performant.

## Gravestones

I'm not providing the implementation for `arrayIntersectionByRedis` here because (1) that's not what I want to talk about and (2) it's a little bit on the longer side and with some basic research on Redis Sets I'm sure you could figure it out. No, what I'm interested in right now is the journey.

No doubt, if each of those failed solutions were deleted when a better idea came along, because the code was dead -- as it would seem that Uncle Bob is advocating -- then in somewhere between 6 months to 60 years, someone (probably me) would come along and see this weird implementation and think to themselves, "that's odd. I bet it would be faster to do X..." and they would be completely unaware that X (and Y and Z and P and D and Q) was already tried.

By leaving behind not only the names of things that were tried in this particularly pernicious problem, but their implementation details too, all with a note at the top of the comment block that explains why the code is commented instead of deleted, that developer (future me) can be reassured that they have in fact not had a new idea and that, should they want to try something, they should be prepared to carefully measure the performance differences.

Those commented out implementations are **gravestones**. They are nearly as useful as the living, breathing code. They warn drive-by developers from thinking they can clever up a better solution without careful, measured dilligence.

Indeed, I thought I had found just such a case at one point. I found a way to do some stuff in the database that seemed, for _days of actual testing and measuring_ to be more performant. I made the change in a branch, and made a PR with a mile-long explanation including screen shots and gifs and a very careful explanation of the problem and _why_ my new solution was better. And then, right as I was building to the conclusion of the PR description, I put my code onto a QA server and ran it there for more production-like performance numbers and, wouldn't you know it, the new solution was rarely any better at all than the one that used Redis, and most of the time equal or slower.

## On Rules

As will become evident in the upcoming Book Club episode of [Working Code][podcast] (Episode 22 on May 12th!), I think that it's super valuable to know what the rules are, but that one of the values of knowing and understanding the rules is so that you know when it makes sense to break them.

You could make the case that instead of leaving the code behind in a comment block, it should be moved to a wiki or an issue/ticket, and that document should be linked in a comment instead. I wouldn't necessarily disagree, but at the time my team didn't have a great ticketing system (oh how quickly we forget about the time before GitHub!) and I have my doubts about whether a single line comment would grab attention like a giant block of commented functions. It's so rare in our codebase that it demands attention.

[podcast]: https://workingcode.dev
[clean-code]: https://amzn.to/2RLc8tb
[sinter]: https://redis.io/commands/sinter
