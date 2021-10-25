import React from 'react';

import { FloatyImage } from '../../components/ImageStyles';
import Layout from '../../components/layout';
import SEO from '../../components/seo';

const IndexPage = ({ data }) => {
	return (
		<Layout title="Adam Tuttle">
			<SEO
				title="Adam Tuttle: JavaScript, Skydiving, Woodworking -- the new Renaissance Man"
				keywords={[`JavaScript`, `Skydiving`, `Woodworking`]}
			/>
			<FloatyImage width={`250px`} img={data.adam} alt="Adam Tuttle" />
			<h2>No problemo!</h2>
			<p>
				Thanks for letting me know you're not interested in Taffy Workshops.
				I'll stop emailing you about them, forever!
			</p>
			<p>
				That's it. No confirm button. No "are you sure?" I respect your inbox.
			</p>
			<p>Have a great day.</p>
		</Layout>
	);
};

export default IndexPage;

export const pageQuery = graphql`
	query taffy_workshop_opt_out {
		adam: file(relativePath: { eq: "about/adam-tuttle-removebg.png" }) {
			childImageSharp {
				fixed(width: 300) {
					...GatsbyImageSharpFixed
				}
			}
		}
	}
`;
