export const NOT_LOGGED_IN = 'NOT_LOGGED_IN';
export const LOGGED_IN = 'LOGGED_IN';

const initialState = {
	loginChecked: false,
	loggedIn: false,
	id: null,
	username: null,
	displayName: null
};

const userReducer = (state = initialState, action) => {
	switch(action.type){
	case LOGGED_IN:
		return{
			...state,
			loginChecked: true,
			loggedIn: true,
			id: action.payload.id,
			username: action.payload.username,
			displayName: action.payload.display_name
		};
	case NOT_LOGGED_IN:
		return{
			loginChecked: true,
			loggedIn: false,
			id: null,
			username: null,
			displayName: null
		};
	default:
		return state;
	}
};

export default userReducer;
