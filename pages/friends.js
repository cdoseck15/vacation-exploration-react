import React, {useState, useEffect} from 'react';
import Layout from '../components/layout';
import {useAxios} from '../constants';
import styles from './friends.module.css';

//This page is used for managing friendships with other users
const Friends = () => {
	const findPopup = 'findPopup';
	const pendingPopup = 'pendingPopup';

	const [popup, setPopup] = useState(null);
	const [users, setUsers] = useState([]);
	const [friends, setFriends] = useState([]);
	const [requests, setRequests] = useState({sent: [], pending: []});

	useEffect(() =>{
		//If the pendingPopup is opened then get the list of all of the pending requests
		if(popup==pendingPopup){
			fetchPending();
		}
		//If the lookupPopup is opened then clear all of the users
		if(popup==findPopup){
			setUsers([]);
		}
	},[popup]);

	//Loads list of friends on first visit to page
	useEffect(() => {
		getFriends();
	},[]);

	//Returns jsx for a lits of friends
	const friendList = friends.map(friend => {
		return (
			<div 
				key={friend.username} 
				className={styles.popupList}
			>
				<p className={styles.popupUsername}>
					{friend.username}
				</p>
				<button
					className={`${styles.popupButton} link`}
					onClick={() => deleteFriend(friend.username)}
				>
					Delete
				</button>
			</div>
		);
	});

	//Used to get a list of the user's friends and add to the friends state
	const getFriends = async () => {
		var response = await useAxios.get('/friends');
		if(response.status < 300){
			setFriends(response.data);
		}
		else{
			alert('Error loading friends');
		}
	};

	//Deletes friend and removed from the friends state
	const deleteFriend = async username => {
		var response = await useAxios.delete('/friends/' + username);
		if(response.status < 300){
			setFriends(
				friends.filter((req) => {
					return req.username != username;
				})
			);
		}
		else{
			alert('Unable to delete friend');
		}
	};

	//If not a blank input lookup the username typed in and set the state to the list of users
	const inputChanged = async e => {
		if(e.target.value.length > 0){
			var response = await useAxios.get('/friends/find/' + e.target.value);
			setUsers(response.data);
		}
		else
			setUsers([]);
	};

	//Send request to user
	const sendRequest = async username => {
		var response = await useAxios.post('/friends/send-request/' + username);
		if(response.status < 300){
			alert('Friend request sent to ' + username);
		}
		setPopup(null);
	};

	//Display button next to username to add
	const userList = users.map(user => {
		return(
			<div 
				key={user.username} 
				className={`${styles.lookupUserList} centered`}
			>
				<p className={styles.popupUsername}>
					{user.username}
				</p>
				<button
					onClick={() => sendRequest(user.username)}
					className={`${styles.popupButton} link`}
				>
					Add
				</button>
			</div>
		);
	});

	//Display popup that is used to find a user to send a friend request to
	const FindPopup = popup==findPopup ?
		<div
			className={`${styles.findPopup} page-component`}
			onClick={e => e.stopPropagation()}
		>
			<h3 className={'center-text'}>
				Find Friend
			</h3>
			<input
				placeholder={'username'}
				onChange={inputChanged}
				className={`${styles.popupInput} centered`}/>
			{userList}
		</div> :
		null;

	//Accepts a friend request from a user and adds that friend to this list of friends as well as removing the request
	const confirmRequest = async username => {
		var response = await useAxios.post('/friends/accept-request/' + username);
		if(response.status < 300){
			setRequests({
				...requests,
				pending: requests.pending.filter(req => {
					return req.username != username;
				})
			});
			setFriends([
				...friends, 
				{username: username, display_name: ''}
			]);
		}
	};

	//Deletes a friend request and removes it from the list of requests
	const deleteRequest = async username =>{
		var response = await useAxios.delete('/friends/deny-request/' + username);
		if(response.status < 300){
			setRequests({
				...requests,
				pending: requests.pending.filter(req => {
					return req.username != username;
				})
			});
		}
	};

	//Cancels a friend request that was sent and removes it from the list of requests
	const cancelRequest = async username => {
		var response = await useAxios.delete('/friends/cancel-request/' + username);
		if(response.status < 300){
			setRequests({
				...requests,
				sent: requests.sent.filter(req => {
					return req.username != username;
				})
			});
		}
	};

	//Get list of pending and sent friend requests
	const fetchPending = async () => {
		var responseSent = await useAxios.get('/friends/sent-requests');
		var responsePending = await useAxios.get('/friends/pending-requests');
		setRequests({
			sent: responseSent.data,
			pending: responsePending.data
		});
	};

	//List of friend requests that have been sent
	const sentList = requests.sent.map(req => {
		return(
			<div key={req.username}>
				<p className={styles.popupUsername}>
					{req.username}
				</p>
				<button
					className={`${styles.popupButton} link`}
					onClick={() => {cancelRequest(req.username);}}
				>
					Cancel
				</button>
			</div>
		);
	});

	//List of freind request that have been sent to user
	const pendingList = requests.pending.map(req => {
		return(
			<div key={req.username}>
				<p className={styles.popupUsername}>
					{req.username}
				</p>
				<button
					className={`${styles.popupButton} link`}
					onClick={() => deleteRequest(req.username)}
				>
						Delete
				</button>
				<button
					className={`${styles.popupButton} link`}
					onClick={() => confirmRequest(req.username)}
				>
					Confirm
				</button>
			</div>
		);
	});

	//Only show this if the pendingPopup is set to show
	const PendingPopup = popup == pendingPopup?
		<div
			className={`${styles.pendingPopup} page-component`}
			onClick={e => e.stopPropagation()}
		>
			<h3 className={'center-text'}>
				Received Requests
			</h3>
			{pendingList}
			<h3 className={'center-text'}>
				Sent Requests
			</h3>
			{sentList}
		</div> :
		null;

	return (
		<Layout pageClick={() => setPopup(null)}>
			<div className={`${styles.friends} page-component`}>
				<h1 className={styles.friendHeader}>
					Friends
				</h1>
				<button
					className={`${styles.findHeader} ${styles.headerButtons} link`}
					onClick={e => {
						setPopup(findPopup);
						e.stopPropagation();
					}}
				>
					Find Friend
				</button>
				<button
					className={`${styles.pendingHeader}	${styles.headerButtons}	link`}
					onClick={e => {
						setPopup(pendingPopup);
						e.stopPropagation();
					}}
				>
					Pending Requests
				</button>
				<div className={styles.friendList}>
					{friendList}
				</div>
				{FindPopup}
				{PendingPopup}
			</div>
		</Layout>
	);
};

export default Friends;