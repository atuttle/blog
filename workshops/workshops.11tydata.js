const { titleCase } = require('title-case');

// This regex finds all wikilinks in a string
const wikilinkRegExp = /\[\[\s?([^\[\]\|\n\r]+)(\|[^\[\]\|\n\r]+)?\s?\]\]/g;

function caselessCompare(a, b) {
	return a.toLowerCase() === b.toLowerCase();
}

module.exports = {
	layout: 'workshop.njk',
	type: 'note',
	discuss: false, //setting this to false (e.g. on the about-me page, turns off the discuss-on-twitter link)
	favorite: false, //most things aren't favorites
	buckets: ['article'], //default to the article bucket
	eleventyComputed: {
		title: (data) => titleCase(data.title || data.page.fileSlug)
	}
};
