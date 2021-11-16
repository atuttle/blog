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

	eleventyConfig.addFilter('lcase', (str) => {
		return str.toLowerCase();
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
					match.url = `/blog/${parts[0].trim()}/`;
				}
			});
		});

	eleventyConfig.addFilter('markdownify', (string) => {
		return md.render(string);
	});

	eleventyConfig.setLibrary('md', md);

	eleventyConfig.addCollection('blog', function (collection) {
		return collection.getFilteredByGlob(['blog/**/*.md', 'index.md']);
	});

	eleventyConfig.addCollection('tags', function (collection) {
		const articles = collection.getFilteredByGlob(['blog/**/*.md']);
		const tags = articles.reduce((agg, article) => {
			if (article.data.tags) {
				const articleTags = article.data.tags;
				articleTags.forEach((t) => {
					if (!(t in agg)) {
						agg[t] = 0;
					}
					agg[t]++;
				});
			}
			return agg;
		}, {});
		// console.log(tags);
		return tags;
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
