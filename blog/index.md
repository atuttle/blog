---
title: All the Things
eleventyExcludeFromCollections: true
discuss: false
---

<!--
# My Favorites

- [Test Driven Development By Example, by Kent Beck](/notes/2021/tdd-by-example-kent-beck/) 📚
- [Time Is All You Have](/notes/2020/time-is-all-you-have/)
- [The Flywheel of Testing](/notes/2021/the-flywheel-of-testing/)
- [Is Impostor Snydrome Actually Good for You?](/notes/2019/is-imposter-syndrome-actually-good-for-you/)
- [Testing Untestable CFML](/notes/2021/testing-untestable-cfml/)
- [Chaotic Good: Creating Determinism Where None Exists](/notes/2021/chaotic-good-creating-determinism-where-none-exists/)
- [Sweat the Small Stuff](/notes/2021/sweat-the-small-stuff/)
- [Getting Started with Taffy: 2020 Edition](/notes/2020/getting-started-with-taffy-2020/)
- [Challenge Breeds Stability](/notes/2020/challenge-breeds-stability/)
- [Slow is Smooth, Smooth is Fast](/notes/2019/slow-is-smooth-smooth-is-fast/)
- [The Cost of Abstraction](/notes/2016/the-cost-of-abstraction/)
- [Cobbler's Children Syndrome](/notes/2016/cobblers-children-syndrome/) &ndash; my backups are better now, but I still haven't restored all of my old content! 😵
-->

<section id="filters">
	<label class="sr-only" for="filterText">Search for something...</label>
	<input type="text" id="filterText" name="filterText" placeholder="Search for something..." />
	<!--
	<label><input type="checkbox" data-highlight="articles" checked /> Include Articles</label>
	<label><input type="checkbox" data-highlight="videos" checked /> Include Videos</label>
	-->
	<img src="/assets/icons8-star-48.png" class="favorite" alt="My favorites" title="My favorites" height="18" /> Items with a star are my favorites.
</section>

<section id="index">
{%- for page in collections.blog reversed -%}
{%- if page.data.title -%}
<article data-buckets="{{page.data.buckets}}" data-title="{{page.data.title | lcase}}">
	{%- if page.data.img -%}
		<div class="thumbnail" style="background-image: url({{page.data.img}});"></div>
	{%- endif -%}
	<h5>
		{%- if page.data.favorite -%}
			<img src="/assets/icons8-star-48.png" class="favorite" alt="My favorites" title="My favorites" />
		{%- endif -%}
		<strong><a href="{{page.url}}">{{page.data.title}}</a></strong>
	</h5>
	<span class="timestamp">{{page.date | asPostDate}}</span>
	<!-- <span class="bucket">{{page.data.buckets}}</span> -->
	<span class="tags">
		{%- for tag in page.data.tags -%}
			<a class="contentTag" href="javascript:alert('todo');">{{tag}}</a>
		{%- endfor -%}
	</span>
	{%- if page.data.desc -%}
		<span class="summary">{{ page.data.desc }}</span>
	{%- endif -%}
	<span class="clearfix"></span>
</article>
{%- endif -%}
{%- endfor -%}
</section>

<script type="text/javascript" src="/assets/search.js"></script>
