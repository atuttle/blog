---
title: All the Things
eleventyExcludeFromCollections: true
discuss: false
---

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
			<a class="contentTag" href="/tags/{{ tag | slug }}/">{{tag}}</a>
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

<script>
	window.tagData = {{ collections.tags | json }}
</script>
<script type="text/javascript" src="/assets/search.js"></script>
