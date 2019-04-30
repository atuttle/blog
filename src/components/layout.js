/**
 * Layout component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { StaticQuery, graphql } from "gatsby"
import Helmet from "react-helmet"

import Header from "./header"
import "./layout.css"

const Layout = ({ children }) => (
	<StaticQuery
		query={graphql`
			query SiteTitleQuery {
				site {
					siteMetadata {
						title
					}
				}
			}
		`}
		render={data => (
			<>
				<Helmet>
					<link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Merriweather:300,700,700italic,300italic|Source+Code+Pro:400" />
				</Helmet>
				<Header siteTitle={data.site.siteMetadata.title} />
				<div
					style={{
						margin: `0 auto`,
						maxWidth: 960,
						padding: `0px 1.0875rem 1.45rem`,
						paddingTop: 0,
					}}
				>
					<main>{children}</main>
					<footer
						style={{
							padding: `10px 10px 50px`,
							textAlign: `center`,
							color: `#333`,
							borderTop: `1px solid #ccc`
						}}
					>
						Made with <a href="https://github.com">GitHub</a>,
						{` `}<a href="https://netlify.com/">Netlify</a>,
						{` `}<a href="https://gatsbyjs.org/">Gatsby</a>, and
						{` `}<a href="https://gatsby-mdx.netlify.com/">MDX</a>,
						by Adam Tuttle in Philadelphia 🏙️
					</footer>
				</div>
			</>
		)}
	/>
)

Layout.propTypes = {
	children: PropTypes.node.isRequired,
}

export default Layout
