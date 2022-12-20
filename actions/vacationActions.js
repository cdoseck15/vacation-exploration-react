import { useAxios } from '../constants';
import {LOAD_VACATIONS, LOAD_ATTRACTIONS, SHOW_ATTRACTIONS, DELETE_VACATION, SAVE_VACATION, ADD_ATTRACTION, DELETE_ATTRACTION, UPDATE_VACATION, RESET_VACATIONS, ALL_LOADED} from '../reducers/vacation';

export const loadVacations = (vacationView, page) => async dispatch => {
	//Load a "page" of vacations to display for the correct vacation view
	var response = await useAxios.get('/vacations/' + vacationView + '?page=' + page);
	//If the response is valid but there are no vacations then set the state to show that all vacations have been loaded
	if (response.status < 300 && response.data.length == 0){
		dispatch({
			type: ALL_LOADED + vacationView
		});
	}
	//If there are vactions that are returned save them to the correct vacation state
	else if (response.status < 300){
		dispatch({
			type: LOAD_VACATIONS + vacationView,
			payload: response.data.map(vacation => {
				return {
					...vacation,
					has_attractions: false,
					show_attractions: false
				};
			})
		});
	}
	else{
		alert('Unable to load vacations');
	}
};

export const loadVacationAttractions = (vacationID) => async dispatch => {
	//Load the list of attractions and save them to the correct vacation
	var response = await useAxios.get('/vacations/' + vacationID + '/attractions');
	if(response.status < 300){
		dispatch({
			type: LOAD_ATTRACTIONS,
			payload: {
				attractions: response.data,
				id: vacationID
			}
		});
	}
};

export const setShowVacationAttractions = (vacation, vacationView, show) => async dispatch => {
	//Display or hide the list of attractions for a vacation
	//If the attractions aren't loaded then load the attractions
	if (!vacation.has_attractions && show){
		await dispatch(loadVacationAttractions(vacation.id));
	}
	dispatch({
		type: SHOW_ATTRACTIONS + vacationView,
		payload: {
			id: vacation.id,
			show: show
		}
	});
};

export const deleteVacation = (vacationID) => async dispatch => {
	//Delete a vacation and remove it from the vacations state
	const response = await useAxios.delete('/vacations/' + vacationID);
	if (response.status < 300){
		dispatch({
			type: DELETE_VACATION,
			payload: {
				id: vacationID
			}
		});
	}
	else{
		alert('Error deleting vacation');
	}
};

export const addVacation = (vacation) => async dispatch => {
	//Create a vacation and add it to the vacations state
	var response = await useAxios.post('/vacations', vacation);
	if (response.status < 300){
		//Save the id that is generated for the vacation created
		const vacationID = response.headers.location;
		//Separate the attractions from the vacation being created
		const {attractions, ...newVacation} = {
			id: vacationID,
			...vacation,
			has_attractions: true,
			show_attractions: false
		};
		//Make sure to start out with a blank array of attractions and add the created vacation to the vacations state
		dispatch({
			type: SAVE_VACATION,
			payload: {
				...newVacation,
				attractions: []
			}
		});
		//With each of the attractions on the vacation create an attraction and add it to the vacation state
		attractions.forEach(attraction => {
			dispatch(addVacationAttraction(attraction, vacationID));
		});
	}
	else {
		alert('Unable to add vacation');
	}
};

export const updateVacation = (vacation) => async dispatch => {
	//Update a vacation and reflect that in the vacations state
	var response = await useAxios.put('/vacations/' + vacation.id, vacation);
	if(response.status < 300){
		dispatch({
			type: UPDATE_VACATION,
			payload: vacation
		});
	}
	else {
		alert('Unable to update vacation');
	}
};

export const addVacationAttraction = (attraction, vacationID) => async dispatch => {
	//Create an attraction on a vacation and add it to the vacation state
	var response = await useAxios.post('/vacations/' + vacationID + '/attractions', attraction);
	if (response.status < 300){
		dispatch({
			type: ADD_ATTRACTION,
			payload: {
				vacationID: vacationID,
				attraction: {
					id: response.headers.location,
					...attraction
				}
			}
		});
	}
	else {
		alert('Unable to add attraction');
	}
};

export const deleteVacationAttraction = (attractionID, vacationID) => async dispatch => {
	//Delete an attraction from a vacation and remove it from the vaction state
	var response = await useAxios.delete('/vacations/' + vacationID + '/attractions/' + attractionID);
	if(response.status < 300){
		dispatch({
			type: DELETE_ATTRACTION,
			payload: {
				vacationID: vacationID,
				attractionID: attractionID
			}
		});
	}
	else {
		alert('Unable to delete attraction');
	}
};

export const refreshVacations = (vacationView) => async dispatch => {
	//Refresh the list of vacations by resetting the view and loading from the start
	dispatch({type: RESET_VACATIONS + vacationView});
	dispatch(loadVacations(vacationView, 0));
};