import {useEffect} from 'react';
import {useAxios} from '../constants';
import {useRouter} from 'next/router';
import {useDispatch} from 'react-redux';
import {logout as logoutAction} from '../actions/userActions';

//This page is used to logout
const Logout = () => {
	const router = useRouter();
	const dispatch = useDispatch();

	//On load of this page it logs the user out
	useEffect(() => {
		logout();
	});

	//Logs the user out, updates the user state, and redirects to the home page
	const logout = async () => {
		var response = await useAxios.post('/logout');
		if(response.status == 200){
			dispatch(logoutAction());
			router.push('/');
		}
		else{
			router.push('/');
			alert('Failed to logout');
		}
	};
};

export default Logout;