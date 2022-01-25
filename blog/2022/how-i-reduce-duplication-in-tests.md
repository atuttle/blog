---
title: "How I Reduce Duplication in Tests"
desc: 'Even if you were already aware of the spread operator, you may not have thought about this opportunity.'
img: /img/2022/phil-shaw-zAZYuch7deE-unsplash.jpg
date: 2022-01-25
tags:
  - javascript
  - testing
---

![Storm Troopers from Star Wars](/img/2022/phil-shaw-zAZYuch7deE-unsplash.jpg)

Photo by <a href="https://unsplash.com/@phillshaw?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Phil Shaw</a> on <a href="https://unsplash.com/s/photos/clone?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>{class="photo-byline"}

When writing tests for a complex bit of logic that has many test cases, I often find myself passing slight variations on input data to a method.

Here's the type of thing I am using it for, cleaned up for sharing in public. I have a function that makes a database query, which behaves in a lot of different possible ways depending on what data is returned. Since we're testing communication across an I/O boundary it makes sense to mock that so that our unit/integration tests can run quickly. So here's one sample record, as mocked for returning for the first query to be executed. This is using [jest][] syntax for mocking, if you're not familiar with it.

```js
const mockResponse = {
	personId: 123,
	dateTimeCreated: '2021-01-11 06:06',
	email: 'foo@bar.com',
	firstName: 'John',
	lastName: 'Smith',
	hasPlumbus: 1,
	isRegistered: 1,
	hasDonated: 1,
	lifetimeDonationSumCents: 10000
};

db.query.mockImplementationOnce(() => [mockResponse]);
```

In reality, the objects I'm using this technique on are easily twice as long as that example.

Now, for the purposes of this discussion, let's assume that you need to test 100 different possible variations of this data handler. The naive approach is to copy and paste the mock data as-is for all 100 tests. And there's nothing inherently wrong with that approach, except that it makes your test files that much larger.

Instead, I like to use the JavaScript [spread operator][spread] to limit what needs to be included in each test to only the parts that affect that test.

```js/14-15
const mockRow = {
	personId: 123,
	dateTimeCreated: '2021-01-11 06:06',
	email: 'foo@bar.com',
	firstName: 'John',
	lastName: 'Smith',
	hasPlumbus: 1,
	isRegistered: 1,
	hasDonated: 1,
	lifetimeDonationSumCents: 10000
};

it('throws for a missing email address', async () => {
	const testData = {
		...mockRow,
		email: null
	};

	db.query.mockImplementationOnce(() => [testData]);

	await expect(async () => app.workOnPerson(123))
		.rejects.toThrow('Email is null');
});
```

In the highlighted lines you can see that I'm creating a new `testData` object, which inherits all of the properties of the `mockRow` object, but then overwrites the `email` property to null, because that's the only one that matters for the purpose of this test. This is extremely useful when you need the entire record to contain something realistic so that you're isolating the one thing you want to test, without duplicating that realistic data between every test.

Why is this important? Well, like I said, without it your test code could potentially grow at an alarming rate. For my current project, even while making heavy use of this technique, I found myself with more than 9 lines of test code (including mock data and mock modules) for every line of application code. Don't take that to mean testing is bad or wasteful, but testing well can be a lot of work and require a lot of setup data.

[jest]: https://jestjs.io/
[spread]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
