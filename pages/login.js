import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useRouter} from 'next/router';
import Modal from 'react-modal';
import GoogleButton from 'react-google-button';
import Layout from '../components/layout';
import {checkLogin} from '../actions/userActions';
import styles from './login.module.css';
import { API_URL } from '../private-constants';


const GOOGLE = 'Google';

Modal.setAppElement('#__next');

const Login = () => {
	const router = useRouter();
	const dispatch = useDispatch();

	//On visiting the page add a listener for when the popup is clsed
	useEffect(() => {
		//Add listener for closing popup window
		window.addEventListener(
			'message',
			event => {
				//Store access and refresh tokens
				const access_token = event.data.access_token;
				const refresh_token = event.data.refresh_token;
				localStorage.setItem('access_token', access_token);
				localStorage.setItem('refresh_token', refresh_token);
				if (event.data.success){
					//Get credentials of user that logged in
					dispatch(checkLogin());
					closeLogin();
				}
			},
			{once: true}
		);
		router.prefetch('/');
	}, []);

	const closeLogin = () => {
		router.push('/');
	};


	const loginClick = provider => {
		//Open popup for loging in on nodejs
		window.open(API_URL + '/login/' + provider ,'_blank','height=600,width=400');
	};

	return (
		<Layout>
			<div>
				<Modal
					isOpen={true}
					contentLabel="Login Modal"
					className={styles.Modal}
				>
					<button 
						onClick={closeLogin} 
						className={`${styles.closeButton} close-button`}
					>
						&times;
					</button>
					<h2 className={styles.loginHeader}>
						Login to have a more personalized exploration
					</h2>
					<GoogleButton 
						className={styles.googleButton} 
						onClick={() => loginClick(GOOGLE)}/>
				</Modal>
			</div>
		</Layout>
	);
};

export default Login;