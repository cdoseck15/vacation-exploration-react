import {combineReducers} from 'redux';

export const PUBLIC = 'public';
export const FRIENDS = 'friends';
export const USER = 'user';
export const LOAD_VACATIONS = 'LOAD_VACATIONS';
export const LOAD_ATTRACTIONS = 'LOAD_ATTRACTIONS';
export const SHOW_ATTRACTIONS = 'SHOW_ATTRACTIONS';
export const DELETE_VACATION = 'DELETE_VACATION';
export const SAVE_VACATION = 'SAVE_VACATION';
export const UPDATE_VACATION = 'UPDATE_VACATION';
export const DELETE_ATTRACTION = 'DELETE_ATTRACTION';
export const ADD_ATTRACTION = 'ADD_ATTRACTION';
export const RESET_VACATIONS = 'RESET_VACATIONS';
export const ALL_LOADED = 'ALL_LOADED';

const initialState = {
	page: 0,
	allLoaded: false,
	vacations: []
};

const loadVacations = (state, action) => {
	return{
		...state,
		page: state.page + 1,
		vacations: [
			...state.vacations,
			...action.payload
		]
	};
};

const loadAttractions = (state, action) => {
	return{
		...state,
		vacations: state.vacations.map(vacation => {
			if(vacation.id == action.payload.id){
				return{
					...vacation,
					has_attractions: true,
					attractions: action.payload.attractions
				};
			}
			return vacation;
		})
	};
};

const showAttractions = (state, action) => {
	return{
		...state,
		vacations: state.vacations.map(vacation => {
			if(vacation.id == action.payload.id){
				return{
					...vacation,
					show_attractions: action.payload.show
				};
			}
			return vacation;
		})
	};
};

const allLoaded = (state) => {
	return {
		...state,
		allLoaded: true
	};
};

const publicVacationReducer = (state = initialState, action) => {
	switch(action.type){
	case LOAD_VACATIONS + PUBLIC:
		return loadVacations(state, action);
	case LOAD_ATTRACTIONS:
		return loadAttractions(state, action);
	case SHOW_ATTRACTIONS + PUBLIC:
		return showAttractions(state, action);
	case RESET_VACATIONS:
	case RESET_VACATIONS + PUBLIC:
		return initialState;
	case ALL_LOADED + PUBLIC:
		return allLoaded(state);
	default:
		return state;
	}
};

const friendVacationReducer = (state = initialState, action) => {
	switch(action.type){
	case LOAD_VACATIONS + FRIENDS:
		return loadVacations(state, action);
	case LOAD_ATTRACTIONS:
		return loadAttractions(state, action);
	case SHOW_ATTRACTIONS + FRIENDS:
		return showAttractions(state, action);			
	case RESET_VACATIONS:
	case RESET_VACATIONS + FRIENDS:
		return initialState;
	case ALL_LOADED + FRIENDS:
		return allLoaded(state);
	default:
		return state;
	}
};

const userVacationReducer = (state = initialState, action) => {
	switch(action.type){
	case LOAD_VACATIONS + USER:
		return loadVacations(state, action);
	case LOAD_ATTRACTIONS:
		return loadAttractions(state, action);		
	case SHOW_ATTRACTIONS + USER:
		return showAttractions(state, action);	
	case DELETE_VACATION:
		return{
			...state,
			vacations: state.vacations.filter(vacation => {
				return vacation.id != action.payload.id;
			})
		};	
	case SAVE_VACATION:
		return {
			...state,
			vacations: [
				action.payload,
				...state.vacations
			]
		};
	case UPDATE_VACATION:
		return {
			...state,
			vacations: state.vacations.map(vacation => {
				if(vacation.id == action.payload.id){
					const newVacation = action.payload;
					return {
						...vacation,
						location: newVacation.location,
						rating: newVacation.rating,
						start_date: newVacation.start_date,
						end_date: newVacation.end_date,
						details: newVacation.details,
						is_public: newVacation.is_public
					};
				}
				return vacation;
			})
		};
	case ADD_ATTRACTION:
		return {
			...state,
			vacations: state.vacations.map(vacation => {
				if(vacation.id == action.payload.vacationID){
					return {
						...vacation,
						attractions: vacation.attractions ? 
							[
								...vacation.attractions,
								action.payload.attraction
							] : 
							[action.payload.attraction]
					};
				}
				return vacation;
			})
		};
	case DELETE_ATTRACTION: 
		return {
			...state,
			vacations: state.vacations.map(vacation => {
				if(vacation.id == action.payload.vacationID){
					return {
						...vacation,
						attractions: vacation.attractions.filter(attraction => {
							return attraction.id != action.payload.attractionID;
						})
					};
				}
				return vacation;
			})
		};
	case RESET_VACATIONS:
	case RESET_VACATIONS + USER:
		return initialState;
	case ALL_LOADED + USER:
		return allLoaded(state);
	default:
		return state;
	}
};

export default combineReducers({
	public: publicVacationReducer,
	friends: friendVacationReducer,
	user: userVacationReducer
});
