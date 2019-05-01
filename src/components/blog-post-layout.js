import React from 'react';
import Helmet from 'react-helmet';
import { Link } from 'gatsby';
import { format, addHours } from 'date-fns';
import Layout from './layout';

const BlogPostLayout = ({ children, pageContext }) => {
	const { title, date } = pageContext.frontmatter;
	const dspDate = addHours(date, 24); //stamps are in UTC so push to the next day so that they display correctly
	return (
		<Layout>
			<Helmet>
				<title>{title}</title>
			</Helmet>
			<article>
				<header style={{ marginBottom: `20px` }}>
					<h1><Link to="/blog">Blog</Link> / {title}</h1>
					<time style={{
						display: `inline-block`,
						padding: `6px 10px`,
						fontSize: `0.8em`
					}}>
						<span style={{ fontSize: `2.3em`, display: `inline-block`, position: `relative`, top: `0.15em` }}>👨‍💻</span>
						{` `}By Adam Tuttle on {format(dspDate, `MMM DD, YYYY`)}
					</time>
				</header>
				{children}
			</article>
		</Layout>
	);
};

export default BlogPostLayout;