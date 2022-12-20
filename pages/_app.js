import '../styles/globals.css';
import React from 'react';
import PropTypes from 'prop-types';
import {Provider} from 'react-redux';
import {store} from '../reducers/store';

MyApp.propTypes ={
	Component: PropTypes.func,
	pageProps: PropTypes.object
};

function MyApp({ Component, pageProps }) {
	return(
		<Provider store={store}>
			<Component {...pageProps} />
		</Provider>
	);
}

export default MyApp;
