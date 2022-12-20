import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Image from 'next/image';
import {useRouter} from 'next/router';
import SidebarMenu from './sidebar-menu';
import {checkLogin} from '../actions/userActions';
import styles from './layout.module.css';

//This component is a wrapper for every page
const Layout = ({children, loginRequired, pageClick, blur}) => {
	const dispatch = useDispatch();
	const router = useRouter();
	const user = useSelector(state => state.user);

	//Used to determine if menu should be shown
	const [showMenu, setShowMenu] = useState(false);

	//If the login hasn't been checked, check to see if there is a user logged in
	useEffect(() => {
		if (!user.loginChecked){
			dispatch(checkLogin());
		}
	}, []);

	useEffect(() => {
		//If there is a new user logged in (one without a username), redirect them to fill out their required account information
		if (user.loggedIn && !user.username){
			router.push('/create-profile');
		}
		//If the page being loaded requires a login push the user to the login page
		else if (loginRequired && !user.loggedIn){
			router.push('/login');
		}
	}, [user]);

	//Handle when somewhere on the page was clicked
	function clicked(){
		if(showMenu){
			setShowMenu(false);
		}
		//Handle callback to function if defined
		if(pageClick){
			pageClick();
		}
	}

	return(
		<>
			<style jsx global>
				{'#__next {height: 100%;}'}
			</style>
			<div 
				className={`page ${blur ? 'blur' : ''}`} 
				onClick={clicked}
			>
				<div className={`${styles.header} content-background`}>
					<button title={'menu'} 
						className={`${styles.sidebarButton} blank-button`} 
						onClick={() => setShowMenu(!showMenu)}
					>
						<Image
							src='/menu.svg'
							alt='menu'
							width={45}
							height={45} />
					</button>
					<Link href='/'>
						<h1 className={styles.title}>
							Vacation Exploration
						</h1>
					</Link>
				</div>
				<SidebarMenu visible={showMenu}/>
				<div className={'page-content'}>
					{children}
				</div>
			</div>
		</>
	);
};

Layout.propTypes ={
	children: PropTypes.object,
	loginRequired: PropTypes.bool,
	pageClick: PropTypes.func, //Used to register a click on the page. Usually used for closing popups
	blur: PropTypes.bool
};

export default Layout;