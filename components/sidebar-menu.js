import React from 'react';
import {useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import Link from 'next/link';
import styles from './sidebar-menu.module.css';

//Created this so that I can return a stylized link each time instead of constantly having to define the class
const MenuLink = ({children, href}) => {
	return(
		<Link href={href}>
			<div className={styles.menuLink}>
				{children}
			</div>
		</Link>
	);
};

MenuLink.propTypes = {
	children: PropTypes.string,
	href: PropTypes.string
};

//This component is used to display a menu
const SidebarMenu = ({visible}) => {
	const user = useSelector((state) => state.user);

	//Hide the menu in each of these scenarios
	if(!visible){
		return null;
	}


	//Show different menu links for logged in users vs not logged in users
	const loginLinks =  user.loggedIn ? [
		<MenuLink 
			href={'/friends'} 
			key={'friends'}
		>
			Friends
		</MenuLink>,
		<MenuLink
			href={'/about'}
			key={'about'}
		>
				About
		</MenuLink>,
		<MenuLink 
			href={'/logout'} 
			key={'logout'}
		> 
			Logout
		</MenuLink>,
	] : [
		<MenuLink
			href={'/about'}
			key={'about'}
		>
			About
		</MenuLink>,
		<MenuLink 
			href={'/login'} 
			key={'login'}
		>
			Login
		</MenuLink>
	];

	//Stop propagation so that the page doesn't close when something internal is clicked
	return(
		<div 
			className={`${styles.sidebar} content-background`} 
			onClick={e => e.stopPropagation()}>
			{loginLinks}
		</div>
	);
};

SidebarMenu.propTypes = {
	visible: PropTypes.bool
};

export default SidebarMenu;