const fs = require('fs');

module.exports = function (eleventyConfig) {
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

	eleventyConfig.addPassthroughCopy('img');
	eleventyConfig.addPassthroughCopy('css');

	// Override Browsersync defaults (used only with --serve)
	eleventyConfig.setBrowserSyncConfig({
		callbacks: {
			ready: function (err, browserSync) {
				const content_404 = fs.readFileSync('_site/404.html');

				browserSync.addMiddleware('*', (req, res) => {
					// Provides the 404 content without redirect.
					res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
					res.write(content_404);
					res.end();
				});
			}
		},
		ui: false,
		ghostMode: false
	});

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
