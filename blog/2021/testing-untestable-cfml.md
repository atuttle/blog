---
title: Testing Untestable CFML
summary: Adam Tuttle shares what he has learned about how DAO's improve code testability
date: 2021-05-25
tags:
  - testing
  - cfml
commentsPostId: testing-untestable-cfml
---

I spoke at some length about my frustrations testing CFML on the ["Testing" episode of my podcast, Working Code][wc-testing] (in February), and I've had some realizations since then, so I wanted to share what I've learned.

**Without a doubt, it was me that failed. It is 100% possible to write clean, testable CFML code, and performant tests.**

In fact, something I didn't understand about TDD until recently was that its primary benefit —at least in my opinion— is not that you've written the tests before/with the code, but rather that _it forces you to write testable code._

This pattern could be repeated with nearly any feature, but the thing I had in mind when I lamented the inability to test my CFML app quickly and efficiently was ORM. Specifically, Adobe's implementation of Hibernate. What I was feeling was that it was impossible to test code that used ORM, but that feeling was wrong. If I had known enough to continue scratching that itch, I might have figured this out sooner.

And I do mean that I figured it out. Even though I have a bachelors degree in Computer Science and roughly 20 years of full time professional coding experience, somehow I managed to make it this far without ever getting a truly ground-up testing education. And what that's meant is that I had to do things the wrong way for a long time, and learn what it feels like to have those pains; _AND_ I had to be exposed to the solutions multiple times because I never truly understood them the at the first few opportunities.

Eventually, through brute force, understanding starts to set in. So here it is. Here's the lesson that I want you to take away from this article:

**If there's something that feels like it's in the way of testing your code, THAT is what's making your code unclean.**

ORM usage is not inherently unclean. But the way that I was using it definitely was, and the design choices I was making seemed innocuous enough at the time...

Why wouldn't the service layer just go ahead and use ORM entities to load data from the database, or make data mutations? That's a very app-logic thing, right? The data is kind of part of the app.

_... right?_

To be clear, even if I had been using SQL instead of ORM, I would have had the exact same problem. My problem wasn't that I was using ORM, it was that Data Access was being intermingled with application logic.

## Data Access Objects

Some time around the year 2008 I recall using a tool from [Brian Rinaldi][br] that would inspect your database and generate a bunch of code to save you time. It output models and services and data access objects. And if I'm being honest, while I thought that I "got it" at the time, I definitely did not.

Data Access Objects exist not just for separation of concerns (keeping db mutations away from app logic) but also to make mocking them ~~easy~~ possible.

Going back to my somewhat-recent frustrations testing CFML, one of my biggest struggles was that for every test I had to make sure that my test-db had its data in the appropriate state before test, then I had to run the test, then I had to make sure that the data in the db was in the state that I expected after the test. Repeat that a few thousand times and it starts to become painfully obvious why you should be mocking the data access layer during tests.

So, if I understand ~~correctly~~ better now, the DAO layer should contain all database access. All readers and all writers. And, more to the point, it doesn't matter if that DAO layer uses ORM or queries or a mix of both or something else.

## Testing Untestable CFML

So sure, the "untestable" bit of the title may be a little click-bait-y but how many of us have _at least one_ app that we consider "untestable"? I'd wager a lot more than 50%!

So here's how you test it: You find the things that make it "untestable," and you pick at those scabs until you understand what it would take to make it testable. Then you refactor the code to make it testable, and you write tests.

Some would say that if you don't have a test for the code you're changing then "[you're not refactoring, you're just changing shit.][changingshit]" I'm starting to agree. Though, if you have existing code and you need to refactor it in order to make it testable and write tests, I don't suppose you have much choice, do you?

## An Example

Say we have a [FW/1][fw1] service for blog posts, with a save method that you use to save changes when the create/edit form is submitted:

```js
component
accessors=true
{

	function save ( id, author, title, body, tags ){
		//option 1: write via query
		queryExecute( /* create/update the post */ );

		//option 2: write via ORM
		transaction {
			var post = entityLoadByPk( 'post', arguments.id );
			post.setTitle(arguments.title);
			//... etc
			entitySave( post );
		}
	}

}
```

How do you write tests for this service?

The biggest problem depicted here is that the service's save method directly updates the database. As shown, you could be doing this via SQL queries or ORM and have the same problem. How do you mock the database operations to make the tests faster and avoid the actual-database-setup-and-teardown work?

It should be obvious now, right? Split it out into a Data Access Object ("DAO"), and then mock that DAO in your tests.

```js
// postService
component
accessors=true
{

	property postDAO;

	function save ( id, author, title, body, tags ){
		postDAO.upsert( id, author, title, slug, body, tags );
	}

}

// postDAO
component {

	function upsert( id, author, title, slug, body, tags ){
		//update the database accordingly
	}

}
```

Now, when you write your tests for `postService`, you can inject the appropriate mock for the test that you're running, the service will have no idea that it's not actually talking to a database, the tests will run much faster, and you won't have to do slow and tedious actual-db setup and teardown.

I'm not going to show how to do the mocking details, just enough to paint the picture of what your tests should look like:

```js
describe("postService", function(){
	it("writes to the database", function(){
		//this next line is mostly just hand-waving...
		var postDAOMock = createPostDAOMock();

		var postService = beanFactory.getBean('postService');
		postService.setPostDAO( postDAOMock );
		postService.save( /* ... */ );

		// use expectations to assert that postDAOMock.upsert was called
		// with certain arguments, or other valuable assertions
	});
});
```

As I alluded to in a recent twitter thread, I wasn't raised in a house that made flossing a priority, and likewise many of my early jobs placed near-zero priority on automated testing, and I've found a bunch of parallels between the two.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Testing your code is like flossing. A thread. 🧵</p>&mdash; 0xADAM (@AdamTuttle) <a href="https://twitter.com/AdamTuttle/status/1395750563078365188?ref_src=twsrc%5Etfw">May 21, 2021</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Obviously I still have a lot to learn in the world of testing. I'll be sure to continue sharing what I learn here.

[wc-testing]: https://workingcode.dev/episodes/009-testing/
[changingshit]: http://hamletdarcy.blogspot.com/2009/06/forgotten-refactorings.html
[br]: https://remotesynthesis.com
[fw1]: https://framework-one.github.io
