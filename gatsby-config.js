module.exports = {
	siteMetadata: {
		title: `On Becoming CTO`,
		description: `A Behind the Curtain Look at My Journey from Software Engineer to CTO`,
		author: `@adamtuttle`,
		siteUrl: `http://adamtuttle.codes`
	},
	plugins: [
		{
			resolve: `gatsby-mdx`,
			options: {
				extensions: [`.mdx`, `.md`],
				defaultLayouts: {
					blog: require.resolve(`./src/components/blog-post-layout.js`),
					pages: require.resolve(`./src/components/layout.js`),
					default: require.resolve(`./src/components/layout.js`)
				},
				gatsbyRemarkPlugins: [
					{
						resolve: 'gatsby-remark-images',
						options: {
							maxWidth: 1035,
							sizeByPixelDensity: true,
							withWebp: true,
							tracedSVG: true
						}
					},
					{
						// https://www.gatsbyjs.org/packages/gatsby-remark-prismjs/
						resolve: `gatsby-remark-prismjs`,
						options: {
							// Class prefix for <pre> tags containing syntax highlighting;
							// defaults to 'language-' (e.g. <pre class="language-js">).
							// If your site loads Prism into the browser at runtime,
							// (e.g. for use with libraries like react-live),
							// you may use this to prevent Prism from re-processing syntax.
							// This is an uncommon use-case though;
							// If you're unsure, it's best to use the default value.
							classPrefix: 'language-',
							// This is used to allow setting a language for inline code
							// (i.e. single backticks) by creating a separator.
							// This separator is a string and will do no white-space
							// stripping.
							// A suggested value for English speakers is the non-ascii
							// character '›'.
							inlineCodeMarker: null,
							// This lets you set up language aliases.  For example,
							// setting this to '{ sh: "bash" }' will let you use
							// the language "sh" which will highlight using the
							// bash highlighter.
							aliases: {},
							// This toggles the display of line numbers globally alongside the code.
							// To use it, add the following line in gatsby-browser.js
							// right after importing the prism color scheme:
							//  require("prismjs/plugins/line-numbers/prism-line-numbers.css")
							// Defaults to false.
							// If you wish to only show line numbers on certain code blocks,
							// leave false and use the {numberLines: true} syntax below
							showLineNumbers: false,
							// If setting this to true, the parser won't handle and highlight inline
							// code used in markdown i.e. single backtick code like `this`.
							noInlineHighlight: false,
							// This adds a new language definition to Prism or extend an already
							// existing language definition. More details on this option can be
							// found under the header "Add new language definition or extend an
							// existing language" below.
							languageExtensions: [
								{
									language: 'superscript',
									extend: 'javascript',
									definition: {
										superscript_types: /(SuperType)/
									},
									insertBefore: {
										function: {
											superscript_keywords: /(superif|superelse)/
										}
									}
								}
							],
							// Customize the prompt used in shell output
							// Values below are default
							prompt: {
								user: 'root',
								host: 'localhost',
								global: false
							},
							// By default the HTML entities <>&'" are escaped.
							// Add additional HTML escapes by providing a mapping
							// of HTML entities and their escape value IE: { '}': '&#123;' }
							escapeEntities: {}
						}
					}
				]
			}
		},
		`gatsby-plugin-react-helmet`,
		`gatsby-plugin-styled-components`,
		{
			resolve: `gatsby-source-filesystem`,
			options: {
				name: `images`,
				path: `${__dirname}/src/images`
			}
		},
		{
			resolve: `gatsby-source-filesystem`,
			options: {
				name: `blog`,
				path: `${__dirname}/src/pages/blog`
			}
		},
		`gatsby-transformer-sharp`,
		`gatsby-plugin-sharp`,
		{
			resolve: `gatsby-plugin-manifest`,
			options: {
				name: `gatsby-starter-default`,
				short_name: `starter`,
				start_url: `/`,
				background_color: `#4f9e5a`,
				theme_color: `#4f9e5a`,
				display: `minimal-ui`,
				icon: `src/images/gatsby-icon.png` // This path is relative to the root of the site.
			}
		},
		{
			resolve: `gatsby-plugin-feed`,
			options: {
				query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
				feeds: [
					{
						serialize: ({ query: { site, allMdx } }) => {
							return allMdx.edges.map(edge => {
								return Object.assign({}, edge.node.frontmatter, {
									description: edge.node.excerpt,
									data: edge.node.frontmatter.date,
									url: site.siteMetadata.siteUrl + edge.node.fields.slug,
									guid: site.siteMetadata.siteUrl + edge.node.fields.slug,
									custom_elements: [{ 'content:encoded': edge.node.html }]
								});
							});
						},

						/* if you want to filter for only published posts, you can do
						 * something like this:
						 * filter: { frontmatter: { published: { ne: false } } }
						 * just make sure to add a published frontmatter field to all posts,
						 * otherwise gatsby will complain
						 **/
						query: `
            {
              allMdx(
                limit: 1000,
                sort: { order: DESC, fields: [frontmatter___date] },
              ) {
                edges {
                  node {
                    fields { slug }
                    frontmatter {
                      title
                      date
                    }
                    html
                  }
                }
              }
            }
            `,
						output: '/rss.xml',
						title: 'On Becoming CTO'
					}
				]
			}
		}
		// this (optional) plugin enables Progressive Web App + Offline functionality
		// To learn more, visit: https://gatsby.dev/offline
		// `gatsby-plugin-offline`,
	]
};
