const { DateTime } = require('luxon');
const pluginSyntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const embedTwitter = require('eleventy-plugin-embed-twitter');

module.exports = function (eleventyConfig) {
	eleventyConfig.addPlugin(pluginSyntaxHighlight);
	eleventyConfig.addPlugin(embedTwitter);

	// https://www.alpower.com/tutorials/formatting-dates-in-eleventy/
	eleventyConfig.addFilter('asPostDate', (dateObj) => {
		return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED);
	});

	const markdownIt = require('markdown-it');
	const markdownItOptions = {
		html: true,
		linkify: true
	};

	const md = markdownIt(markdownItOptions)
		.use(require('markdown-it-footnote'))
		.use(require('markdown-it-attrs'))
		.use(function (md) {
			// Recognize Mediawiki links ([[text]])
			md.linkify.add('[[', {
				validate: /^\s?([^\[\]\|\n\r]+)(\|[^\[\]\|\n\r]+)?\s?\]\]/,
				normalize: (match) => {
					const parts = match.raw.slice(2, -2).split('|');
					parts[0] = parts[0].replace(/.(md|markdown)\s?$/i, '');
					match.text = (parts[1] || parts[0]).trim();
					match.url = `/notes/${parts[0].trim()}/`;
				}
			});
		});

	eleventyConfig.addFilter('markdownify', (string) => {
		return md.render(string);
	});

	eleventyConfig.setLibrary('md', md);

	eleventyConfig.addCollection('notes', function (collection) {
		return collection.getFilteredByGlob(['notes/**/*.md', 'index.md']);
	});

	eleventyConfig.addCollection('recent', function (collection) {
		return (
			collection
				.getFilteredByGlob(['notes/**/*.md'])
				//only include content with a date <= now
				.filter((post) => post.data.page.date <= new Date())
				//get the most recent first
				.sort((L, R) => {
					const Ldate = L.data.page.date;
					const Rdate = R.data.page.date;
					return Ldate < Rdate ? 1 : Ldate > Rdate ? -1 : 0;
				})
				//we only want 3 of em
				.slice(0, 3)
		);
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
