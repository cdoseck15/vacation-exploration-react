import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import Modal from 'react-modal';
import {useSelector, useDispatch} from 'react-redux';
import {useAxios} from '../constants';
import Layout from '../components/layout';
import {updateUser} from '../actions/userActions';
import styles from './create-profile.module.css';

//This sets the modal to use the whole page
Modal.setAppElement('#__next');

//This page is used to create information that is required to use a profile
const CreateProfile = () => {
	const router = useRouter();
	const dispatch = useDispatch();
	const user = useSelector(state => state.user);

	const [username, setUsername] = useState(user.username);
	const [validUsername, setValidUsername] = useState(false);

	//When user changes if the logged in user has a username already then go to the home page
	useEffect(() => {
		if(user.username != null){
			router.push('/');
		}
	}, [user]);

	//Save the user information
	const saveAccount = async () => {
		await dispatch(updateUser({
			...user,
			username: username
		}));
	};

	//Check if the username is valid and set the states for if its valid and for the username
	const changeUsername = async e => {
		var response = await useAxios.get('/user/check-username?username=' + e.target.value);
		setValidUsername(response.data.valid);
		setUsername(e.target.value);
	};

	return (
		<Layout>
			<div className={'sandia-background'}>
				<div className={styles.Modal}>
					<h2 className={styles.loginHeader}>
						You must set a username to finish creating your account.
					</h2>
					<input 
						className={styles.usernameInput} 
						onChange={changeUsername} 
					/>
					{username == null || username.length < 6 ? 
						<p className={styles.warning}>
							Username must be at least 6 characters long
						</p> : 
						null
					}
					{username != null && username.length >= 6 && !validUsername ? 
						<p className={styles.warning}>
							This username is taken or invalid
						</p>: 
						null
					}
					<button 
						className={styles.usernameButton} 
						onClick={saveAccount} 
						disabled={!validUsername}
					>
						Save Username
					</button>
				</div>
			</div>
		</Layout>
	);
};

export default CreateProfile;