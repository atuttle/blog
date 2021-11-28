const { DateTime } = require('luxon');
const pluginRss = require('@11ty/eleventy-plugin-rss');
const pluginSyntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const embedTwitter = require('eleventy-plugin-embed-twitter');
const webmentionsFilters = require('./_11ty/filters');

module.exports = function (eleventyConfig) {
	eleventyConfig.addPlugin(pluginRss);
	eleventyConfig.addPlugin(pluginSyntaxHighlight);
	eleventyConfig.addPlugin(embedTwitter);

	// https://www.alpower.com/tutorials/formatting-dates-in-eleventy/
	eleventyConfig.addFilter('asPostDate', (dateObj) => {
		return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED);
	});

	eleventyConfig.addFilter('lcase', (str) => {
		return str.toLowerCase();
	});

	eleventyConfig.addFilter('htmlencode', (str) => {
		return str.replace(/"/g, '&quot;');
	});

	eleventyConfig.addFilter('htmlDateString', (dateObj) => {
		return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('yyyy-LL-dd');
	});

	eleventyConfig.addFilter('sortTagsAlpha', (tagCollection) => {
		return tagCollection.sort((L, R) => (L.tag > R.tag ? 1 : -1));
	});

	eleventyConfig.addFilter('absoluteUrl', (url) => `https://adamtuttle.codes${url}`);

	Object.keys(webmentionsFilters).forEach((filterName) => {
		eleventyConfig.addFilter(filterName, webmentionsFilters[filterName]);
	});

	const markdownIt = require('markdown-it');
	const markdownItOptions = {
		html: true,
		linkify: true
	};

	const md = markdownIt(markdownItOptions)
		.use(require('markdown-it-footnote'))
		.use(require('markdown-it-attrs'))
		.use(require('markdown-it-anchor'))
		.use(function (md) {
			// Recognize Mediawiki links ([[text]])
			md.linkify.add('[[', {
				validate: /^\s?([^\[\]\|\n\r]+)(\|[^\[\]\|\n\r]+)?\s?\]\]/,
				normalize: (match) => {
					const parts = match.raw.slice(2, -2).split('|');
					parts[0] = parts[0].replace(/.(md|markdown)\s?$/i, '');
					match.text = (parts[1] || parts[0]).trim();
					match.url = `/blog/${parts[0].trim()}/`;
				}
			});
		});

	eleventyConfig.addFilter('markdownify', (string) => {
		return md.render(string);
	});

	eleventyConfig.setLibrary('md', md);

	const published = (entry) => {
		const now = new Date();
		// console.log({ title: entry.data.title, future: entry.data.date > now });
		return entry.data.date <= now;
	};

	eleventyConfig.addCollection('blog', function (collection) {
		return collection.getFilteredByGlob(['blog/**/*.md', 'index.md']).filter(published);
	});

	eleventyConfig.addCollection('blogLatest', function (collection) {
		return collection.getFilteredByGlob(['blog/**/*.md', 'index.md']).filter(published).slice(-1);
	});

	eleventyConfig.addCollection('tagsByCount', function (collection) {
		const articles = collection.getFilteredByGlob(['blog/**/*.md']);
		const tags = articles.reduce((agg, article) => {
			if (article.data.tags) {
				const articleTags = article.data.tags;
				articleTags.forEach((t) => {
					let ix = agg.findIndex((i) => i.tag === t);
					if (ix === -1) {
						ix = agg.length;
						agg[ix] = { tag: t, count: 0 };
					}
					agg[ix].count++;
				});
			}
			return agg;
		}, []);
		const sorted = tags.sort((L, R) => (L.count === R.count ? (L.tag > R.tag ? 1 : -1) : L.count > R.count ? -1 : 1));
		return sorted;
	});

	eleventyConfig.addPassthroughCopy('assets');
	eleventyConfig.addPassthroughCopy('img');

	return {
		useGitIgnore: false,
		dir: {
			input: './',
			output: '_site',
			layouts: 'layouts',
			includes: 'includes',
			data: '_data'
		},
		passthroughFileCopy: true
	};
};
