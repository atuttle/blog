import React from 'react';

import { FloatyImage } from '../../components/ImageStyles';
import Layout from '../../components/layout';
import SEO from '../../components/seo';

const IndexPage = ({ data }) => {
	return (
		<Layout title="Adam Tuttle">
			<SEO
				title="Taffy Workshops by Adam Tuttle"
				keywords={[`Taffy`, `REST`, `CFML`]}
			/>
			<FloatyImage width={`250px`} img={data.adam} alt="Adam Tuttle" />
			<h2>Taffy Workshops</h2>
			<p>More information coming soon.</p>
		</Layout>
	);
};

export default IndexPage;

export const pageQuery = graphql`
	query taffy_workshop_register {
		adam: file(relativePath: { eq: "about/adam-tuttle-removebg.png" }) {
			childImageSharp {
				fixed(width: 300) {
					...GatsbyImageSharpFixed
				}
			}
		}
	}
`;
