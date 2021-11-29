---
title: Using bCrypt in ColdFusion 10
summary:
img: https://adamtuttle.codes/img/2021/dumbbell.jpg
date: 2012-06-06
tags:
  - coldfusion
  - security
---

What follows is an article [originally written by John Whish][orig], reproduced here with his permission. I'm re-posting it because his blog has since gone offline and I like linking to this information, including to [in my book, REST Assured][restassured]. I'm posting this from the future **(2021! The hoverboards are everything we ever dreamed of and more! <img src="/img/2012/hoverboard.gif" alt="hover boards omg!" style="max-height: 1.4em; margin: 0 4px -7px 0" />)** but back-dating the entry to match John's original post date.

---

As you may have seen on the twitterverse, it has been reported that [6.5 Million LinkedIn Password Hashes Leaked][yc]. There are several comments about using bCrypt (or sCrypt) to provide improved security and this reminded me that Marc Esher blogged about [Hashing passwords with bcrypt in ColdFusion][marc]. Since Marc posted this, ColdFusion 10 has been released which has improved Java integration. so I thought I'd take his code and do it using ColdFusion 10 and here it is:

**Application.cfc**

```js
component {
  this.name = "bcrypt_in_cf10";
  this.javaSettings = {
    LoadPaths = ["/classfiles"]
  };
}
```

I also needed to create a directory called "classfiles" and drop in the BCrypt.class script (which I downloaded from [here][download])

**bcrypttest.cfm**

```js
<cfscript>
	bcrypt = CreateObject( "java", "BCrypt" ); WriteDump( bcrypt ); pw = "happy1.!gIlm0re"; startts = getTickCount();
	hashed = bcrypt.hashpw(pw, bcrypt.gensalt()); writeoutput("created password '" & hashed & "' in " & getTickCount() -
	startts & " ms"); startts = getTickCount(); match = bcrypt.checkpw(pw, hashed); writeoutput("checked pw match
	(#match#) in " & getTickCount() - startts & " ms"); startts = getTickCount(); hashed = bcrypt.hashpw(pw,
	bcrypt.gensalt(12)); writeoutput("created password '" & hashed & "' in " & getTickCount() - startts & " ms"); startts
	= getTickCount(); match = bcrypt.checkpw(pw, hashed); writeoutput("checked password match (#match#) in " &
	getTickCount() - startts & " ms"); // just for giggles try an incorrect password startts = getTickCount(); match =
	bcrypt.checkpw("5p1na1.Tap", hashed); writeoutput("checked incorrect password match (#match#) in " & getTickCount() -
	startts & " ms");
</cfscript>
```

Pretty simple huh!

[orig]: https://web.archive.org/web/20160531090150/http://www.aliaspooryorik.com/blog/index.cfm/e/posts.details/post/using-bcrypt-in-coldfusion-10-370
[restassured]: https://restassuredbook.com
[yc]: https://news.ycombinator.com/item?id=4073309
[marc]: http://blog.mxunit.org/2011/02/hashing-passwords-with-bcrypt-in.html
[download]: https://s3.amazonaws.com/marc.esher/BCrypt.class
