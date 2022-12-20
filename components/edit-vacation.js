import React, {useState, useRef, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import DatePicker from 'react-datepicker';
import Script from 'next/script';
import {GOOGLE_API_KEY} from '../private-constants';
import 'react-datepicker/dist/react-datepicker.css';
import StarSVG from '../public/plane-f.svg';
import PropTypes from 'prop-types';
import GooglePlacesAutocomplete from '../components/google-places-autocomplete';
import styles from './edit-vacation.module.css';
import { addVacation, updateVacation, deleteVacationAttraction, addVacationAttraction } from '../actions/vacationActions';
/*global google*/

const Star = ({id, setHover, setRating, hover, rating}) => {
	//The star is actually an airplane cause I thought that was cool but works the same as stars on other sites

	//It sets the stars to blue if they are selected, below selected, hovered over, or below hovered over
	//Sets the hover as they are hovered over and set the rating when clicked on
	return(
		<label className={styles.star}>
			<button
				type={'button'}
				id={id}
				value={id}
				className={styles.starButton}
			>
				<StarSVG
					height={'50'}
					width={'50'}
					fill={id <= hover || (!hover & id <= rating) ? 'DeepSkyBlue': 'none'}
					strokeWidth={id <= hover || (!hover & id <= rating) ? '1' : '0.5'}
					stroke={id <= hover || (!hover & id <= rating) ? 'DeepSkyBlue' : 'black'}
					onMouseEnter={() => setHover(id)}
					onMouseLeave={() => setHover(null)}
					onClick={() => {rating == id ? setRating(null) : setRating(id);}}
				/>
			</button>
		</label>
	);
};

Star.propTypes ={
	id: PropTypes.number,
	setHover: PropTypes.func,
	setRating: PropTypes.func,
	hover: PropTypes.number,
	rating: PropTypes.number
};

const EditVacation = ({closePopup, vacation}) => {
	const [location, setLocation] = useState(null);
	const [vacationID, setVacationID] = useState(null);
	const ratings = [1, 2, 3, 4, 5];
	const [hover, setHover] = useState(null);
	const [rating, setRating] = useState(null);
	//Sets the start date to 6 days ago
	const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 6)));
	const [endDate, setEndDate] = useState(new Date());
	const [attractions, setAttractions] = useState([]);
	const [bounds, setBounds] = useState(null);
	const [publicPost, setPublicPost] = useState(false);
	const [deletedAttractions, setDeletedAttractions] = useState([]);
	const detailsRef = useRef(null);
	const dispatch = useDispatch();
	const user = useSelector(state => state.user);

	//Options to show in the selecting of the location for the vacation
	const options = {
		fields: ['name', 'place_id', 'types', 'geometry'],
	};

	//Options to show in the selecting of the location for the vacation
	//bounds makes it show results closer to the location of the vacation first
	const attractionOptions = {
		fields: ['name', 'place_id', 'types'],
		bounds: bounds
	};

	//On initial load of this component if there is a vacation passed to it, populate the local states with that vacation information
	useEffect(() => {
		if (vacation){
			setVacationID(vacation.id);
			setLocation(vacation.location);
			setRating(vacation.rating);
			setStartDate(new Date(vacation.start_date));
			setEndDate(new Date(vacation.end_date));
			setPublicPost(vacation.is_public);
			detailsRef.current.value = vacation.details;
			setAttractions(vacation.attractions);
		}
	}, []);

	//Selects the location of the vacation
	const autocompleteResults = (places) => {
		//Sets the area to look in for attractions on the vacation
		setBounds(new google.maps.LatLngBounds(
			{
				lat: places.geometry.location.lat() - 0.5,
				lng: places.geometry.location.lng() - 0.5
			},
			{
				lat: places.geometry.location.lat() + 0.5,
				lng: places.geometry.location.lng() + 0.5
			}));

		//Sets the location of the vacation
		setLocation({
			name: places.name,
			place_id: places.place_id,
			lat: places.geometry.location.lat(),
			lng: places.geometry.location.lng()
		});
	};

	//Removes the location and attractions of the vacation
	const removeLocation = () => {
		setLocation(null);
		setBounds(null);
		setAttractions([]);
	};

	//Adds an attraction to the list of attractions
	const addAttractionItem = (places) => {
		setAttractions((prevAttractions) => {
			return [...prevAttractions,
				{
					location: {
						name: places.name,
						place_id: places.place_id
					}
				}];
		});
	};

	//Removes a single attraction from the list of attractions
	function removeAttraction(places){
		//If the attraction has an ID then add it to an array of attractions to be deleted
		if(places.id){
			setDeletedAttractions(attraction => [
				...attraction,
				places.id
			]);
		}
		setAttractions((prevAttractions) => {
			return prevAttractions.filter(attraction => {
				return attraction.location.place_id != places.location.place_id;
			});
		});
	}

	//Submits the vacation to the database
	const submitVacation = async () => {
		const vacation = {
			location: location,
			rating: rating,
			start_date: startDate,
			end_date: endDate,
			details: detailsRef.current.value,
			attractions: attractions,
			is_public: publicPost,
			username: user.username,
			user_id: user.id
		};
		//This vacation is a new vacation to be added
		if(!vacationID){
			await dispatch(addVacation(vacation));
		}
		else{
			//Update the deatils on the vacation
			vacation.id = vacationID;
			dispatch(updateVacation(vacation));
			//Delete attractions that have been marked to be deleted
			deletedAttractions.forEach(attractionID => {
				dispatch(deleteVacationAttraction(attractionID, vacationID));
			});
			//Add attractions that don't have an ID to the vacation state
			attractions.forEach(attraction => {
				if(!attraction.id){
					dispatch(addVacationAttraction(attraction, vacationID));
				}
			});
		}
		closePopup();
	};

	//Returns the jsx for the list of stars for rating the vacation
	const stars = ratings.map((rate) => {
		return(
			<Star
				id={rate}
				key={rate}
				setHover={id => setHover(id)}
				hover={hover}
				rating={rating}
				setRating={id => setRating(id)}
			/>
		);
	});

	//Returns the jsx for the list of attractions
	const attractionList = attractions.map((attraction, index) => {
		return(
			<div key={index}>
				<span className={styles.attractionLocation}>
					{attraction.location.name}
					<button 
						onClick={() => removeAttraction(attraction)} 
						className={`${styles.attractionClose} close-button`}
					>
							&times;
					</button>
				</span>
			</div>
		);
	});

	return (
		<>
			{vacation ? 
				<Script
					src={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`}
					strategy="lazyOnload"
					onReady={() => {
						//On loading of the google script set the bounds of the vacation if a vacation is passed
						if(vacation){
							setBounds(new google.maps.LatLngBounds(
								{
									lat: vacation.location.lat - 0.5,
									lng: vacation.location.lng - 0.5,
								},
								{
									lat: vacation.location.lat + 0.5,
									lng: vacation.location.lng + 0.5,
								}
							));
						}
					}}/> :
				null
			}
			<div
				className={`${styles.editPostBackground}`}
				onClick={e => {
					closePopup();
					e.stopPropagation();
				}}>
				<div
					className={`${styles.editPost} page-component`}
					onClick={e => e.stopPropagation()}
				>
					<h2 className={styles.header}>
						{vacationID ? 'Edit Vacation' : 'Create Vacation'}
					</h2>
					<div
						className={`${publicPost ? styles.publicPost : styles.privatePost} shadow`}
						onClick={() => setPublicPost(!publicPost)}>
						{publicPost ? 'Public' : 'Friends'}
						<div className={`${publicPost ? styles.selectorRight : styles.selectorLeft} shadow`} />
					</div>
					<div className={styles.selectLocation}>
						{!location ?
							<GooglePlacesAutocomplete
								className={styles.googleInput}
								getPlace={autocompleteResults}
								options={options}
							/> :
							<>
								<span className={styles.locationName}>
									{location.name}
								</span>
								<button 
									onClick={() => removeLocation()} 
									className={`${styles.closeButton} close-button`}>
										&times;
								</button>
							</>
						}
					</div>
					<h3 className={styles.header}>
						Rating
					</h3>
					<p className={styles.subHeader}>
						{hover ? hover : rating ? rating : 0}/5
					</p>
					<div className={'center-text'}>
						{stars}
					</div>
					<h3 className={styles.header}>
						Vacation Dates
					</h3>
					<div className={'center-text'}>
						<DatePicker
							selected={startDate}
							startDate={startDate}
							endDate={endDate}
							onChange={(dates) => {
								const[start, end] = dates;
								setStartDate(start);
								setEndDate(end);
							}}
							selectsRange
							dateFormat="MMM d, yyyy"
							monthsShown={2}
						/>
					</div>
					<h3 className={styles.header}>
						Vacation Details
					</h3>
					<div className={styles.vacationDetailsDiv}>
						<textarea 
							className={styles.vacationDetails} 
							ref={detailsRef}/>
					</div>
					<h3 className={styles.header}>
						Attractions
					</h3>
					<div className={styles.selectLocation}>
						{bounds ?
							<GooglePlacesAutocomplete
								className={styles.googleInput}
								getPlace={addAttractionItem}
								options={attractionOptions}
							/> :
							null
						}
					</div>
					<div className={styles.attractionList}>
						{attractionList}
					</div>
					<br/>
					<button
						disabled={!(location && rating && startDate && endDate)}
						onClick={() => {submitVacation();}}
						className={styles.finishButton}
					>
						{vacationID ? 'Save': 'Post'}
					</button>
				</div>
			</div>
		</>
	);
};

EditVacation.propTypes = {
	closePopup: PropTypes.func,
	vacation: PropTypes.object
};

export default EditVacation;