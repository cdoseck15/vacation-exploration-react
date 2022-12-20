import React, {useEffect, useState} from 'react';
import Layout from '../components/layout';
import PropTypes from 'prop-types';
import { useAxios } from '../constants';

const About = () => {
	const [about, setAbout] = useState('');
	const [future, setFuture] = useState('');

	const setText = async () => {
		var response = await useAxios.get('/static_texts/about');
		setAbout(response.data.text);
		response = await useAxios.get('/static_texts/future');
		setFuture(response.data.text);
	};

	useEffect(() => {
		setText();
	});
	return (
		<Layout>
			<div>
				<div className={'page-component'}>
					<h1 className={'center-text'}>
            About
					</h1>
					{about}
				</div>
				<div className={'page-component'}>
					<h1 className={'center-text'}>
            Future
					</h1>
					{future}
				</div>
			</div>
		</Layout>
	);
};

About.propTypes = {
	about: PropTypes.string,
	future: PropTypes.string
};

export default About;