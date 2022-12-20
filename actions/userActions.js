import {useAxios} from '../constants';
import {LOGGED_IN, NOT_LOGGED_IN} from '../reducers/user';
import {RESET_VACATIONS} from '../reducers/vacation';

export const checkLogin = () => async dispatch => {
	//This funciton is used to get the user information for any credentials stored from passport js from the server
	const response = await useAxios.get('/user/credentials');
	if (response.data.id){
		dispatch({type: LOGGED_IN, payload: response.data});
		//When the user is logged in reset the vacations as they will be different
		dispatch({type: RESET_VACATIONS});
	}
	else{
		dispatch({type: NOT_LOGGED_IN});
	}
};

export const updateUser = (user) => async dispatch => {
	//Used to update user info
	const response = await useAxios.put('/user', user);
	if (response.status < 300){
		dispatch({type: LOGGED_IN, payload: user});
	}
};

export const logout = () => dispatch => {
	//Used to logout
	localStorage.removeItem('access_token');
	localStorage.removeItem('refresh_token');
	dispatch({type: NOT_LOGGED_IN});
	//When the user is logged out reset the vacations as they will be different
	dispatch({type: RESET_VACATIONS});
};
