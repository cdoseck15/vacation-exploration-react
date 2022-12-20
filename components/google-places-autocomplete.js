import React, {useRef} from 'react';
import Script from 'next/script';
import PropTypes from 'prop-types';
import {GOOGLE_API_KEY} from '../private-constants';
/*global google*/

//This component is an input that looks up google locations
const GooglePlacesAutocomplete = ({getPlace, options, className}) => {
	const googleRef = useRef(null);
	var autocomplete = {};

	//When a place is selected pass the results to the function passed in
	const placeSelected = () => {
		getPlace(autocomplete.getPlace());
		googleRef.current.value = '';
	};

	return(
		<>
			<Script
				src={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`}
				strategy="lazyOnload"
				onReady={() => {
					//After loading assign the google places autocomplete to the input and add a listener for when a place is selected
					console.log('Google Places Autocomplete Loaded');
					autocomplete = new google.maps.places.Autocomplete(googleRef.current, options);
					autocomplete.addListener('place_changed', placeSelected);
				}}
			/>
			<input
				id="google-places"
				ref={googleRef}
				className={className}
			/>
		</>
	);
};

GooglePlacesAutocomplete.propTypes ={
	getPlace: PropTypes.func,
	options: PropTypes.object,
	className: PropTypes.string
};

export default GooglePlacesAutocomplete;