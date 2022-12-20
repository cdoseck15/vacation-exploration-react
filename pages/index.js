import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {loadVacations, setShowVacationAttractions, loadVacationAttractions, deleteVacation, refreshVacations} from '../actions/vacationActions';
import {PUBLIC, FRIENDS, USER} from '../reducers/vacation';
import Head from 'next/head';
import Layout from '../components/layout';
import EditVacation from '../components/edit-vacation';
import MoreButton from '../public/more-horizontal-f.svg';
import styles from './index.module.css';

export default function Home() {
	const user = useSelector((state) => state.user);
	const [vacationView, setVacationView] = useState(user.loggedIn ? FRIENDS : PUBLIC);
	const vacationState = useSelector((state) => state.vacations[vacationView]);
	const dispatch = useDispatch();
	const [editVacationID, setEditVacationID] = useState(null);
	const [menuID, setMenuID] = useState(null);

	//When the vacation view is changed load up vacations if no pages of vacations have been loaded for that view
	useEffect(() => {
		if(!vacationState.page){
			dispatch(loadVacations(vacationView, 0));
		}
	}, [vacationView]);

	//When the user is changed switch the view to friends when the user is logged in otherwise change the view to public
	useEffect(() => {
		if(user.loggedIn){
			setVacationView(FRIENDS);
		}
		else{
			setVacationView(PUBLIC);
		}
	}, [user]);

	//When the Edit or New Vacation button is clicked make sure that if a vacation is being edited that it has the attractions loaded
	useEffect(() => {
		if(editVacationID){
			const selectedVacation = vacationState.vacations.filter(vacation => {
				return vacation.id == editVacationID;
			})[0];
			if(!selectedVacation.has_attractions){
				dispatch(loadVacationAttractions(selectedVacation.id));
			}
		}
	}, [editVacationID]);

	//Shows the Edit/Post Vacation screen based on the value showEditVacationID
	//If the details aren't loaded for the vacation that is selected then it doesn't show the edit screen
	const editVacationObj =
		editVacationID == null ||
		(editVacationID != 0 &&
		!vacationState.vacations.filter(vacation => {
			return vacation.id == editVacationID;
		})[0].has_attractions) ?
			null :
			<EditVacation
				closePopup={() => setEditVacationID(null)}
				vacation={editVacationID == 0 ?
					null :
					vacationState.vacations.filter(vacation => {
						return vacation.id == editVacationID && vacation.has_attractions;
					})[0]}
			/>;

	//Returns a jsx list of vacations
	const vacationList = vacationState.vacations ?
		vacationState.vacations.map(vacation => {
			//Shows a menu if the menu has been opened for that vacation
			const menu = vacation.id == menuID ?
				<div
					className={`${styles.menu} page-component`}
					onClick={e => e.stopPropagation()}>
					<button
						className={`blank-button ${styles.menuButton}`}
						onClick={() => {
							setEditVacationID(vacation.id);
							setMenuID(null);}}
					>
						Edit
					</button>
					<button
						className={`blank-button ${styles.menuButton}`}
						onClick={() => dispatch(deleteVacation(vacation.id))}
					>
						Delete
					</button>
				</div> :
				null;
			
			//Returns a list of attractions if they are shown for this vacation
			const attractionList = vacation.show_attractions && vacation.attractions ? 
				vacation.attractions.map(attraction => {
					return <div 
						key={attraction.id} 
						className={styles.attraction}
					>
						{attraction.location.name}
					</div>;
				}):
				null;
				
			//Returns the jsx for a vacation
			return (
				<div 
					className={`${styles.vacation} page-component`} 
					key={vacation.id}
				>
					{menu}
					<h4 className={`${styles.vacationHeader}`}>
						{vacation.username}
					</h4>
					<h2 className={`${styles.vacationHeader}`}>
						{vacation.location.name}
					</h2>
					<h4 className={`${styles.vacationHeader}`}>
						{vacationView != USER ? null : vacation.is_public ? 'Public' : 'Friends Only'}
					</h4>
					<h4 className={`${styles.ratingHeader} center-text`}>
						{vacation.rating}/5
					</h4>
					{user.id == vacation.user_id && vacationView == USER?
						<div className={styles.moreButton}>
							<MoreButton
								height={'20'}
								width={'20'}
								fill={'black'}
								className={styles.MoreButton}
								onClick={e => {
									setMenuID(vacation.id);
									e.stopPropagation();
								}}
							/>
						</div>:
						null}
					<h4 className={`${styles.dateHeader}`}>
						{(new Date(vacation.start_date)).toLocaleDateString('en-US', {month:'short', day: 'numeric', year: 'numeric'})}
						{' - '}
						{(new Date(vacation.end_date)).toLocaleDateString('en-US', {month:'short', day: 'numeric', year: 'numeric'})}
					</h4>
					<h4 className={styles.subHeader}>
						Details
					</h4>
					<div className={styles.details}>
						{vacation.details}
					</div>
					{vacation.show_attractions ?
						<>
							<h4 className={styles.subHeader}>
								Attractions
							</h4>
							{attractionList}
						</>:
						null}
					{vacation.show_attractions ?
						<button
							className={`${styles.attractionsButton} blank-button`}
							onClick={() => dispatch(setShowVacationAttractions(vacation, vacationView, false))}>
							Hide Attractions
						</button> :
						<button
							className={`${styles.attractionsButton} blank-button`}
							onClick={() => dispatch(setShowVacationAttractions(vacation, vacationView, true))}>
							Show Attractions
						</button>
					}
				</div>
			);
		}) : 
		null;

	return(
		<>
			<Layout
				blur={editVacationID != null}
				pageClick={() => setMenuID(null)}>
				<div>
					<Head>
						<title>
							Vacation Exploration
						</title>
						<meta name="description" content="Generated by create next app" />
						<link rel="icon" href="/favicon.ico" />
					</Head>
					<div className={styles.headerSpace}>
						<div className={`${styles.pageHeader} page-component`}>
							{user.loggedIn ? 
								<>
									<div className={`${styles.buttonGroup}`}>
										<h3 
											className={`${styles.leftButton} ${vacationView == PUBLIC ? styles.selectedView : null} center-text`}
											onClick={() => setVacationView(PUBLIC)}>
												Public
										</h3>
										<h3 
											className={`${styles.centerButton} ${vacationView == FRIENDS ? styles.selectedView : null} center-text`}
											onClick={() => setVacationView(FRIENDS)}>
										Friends
										</h3>
										<h3 
											className={`${styles.rightButton} ${vacationView == USER ? styles.selectedView : null} center-text`}
											onClick={() => setVacationView(USER)}>
										User
										</h3>
									</div>
									<h3
										className={`${styles.newVacationButton} link`}
										onClick={e => {
											setEditVacationID(0);
											e.stopPropagation();
										}}>
										New Vacation
									</h3>
								</>	:
								<h3 className={`${styles.publicHeader} center-text`}>
									Public Vacations
								</h3>
							}
							<div 
								className={`${styles.refreshButton} page-component`}
								onClick={() => dispatch(refreshVacations(vacationView))}
							>
								Refresh
							</div>
						</div>
					</div>
					{vacationList}
					{vacationState.allLoaded ? 
						<div className={`${styles.noMoreContent} page-component center-text`}>
								No vacations to load 
						</div>: 
						<div 
							className={`${styles.moreContentButton} link-component center-text`}
							onClick={() => dispatch(loadVacations(vacationView, vacationState.page))}
						>
							Load More
						</div>
					}
				</div>
			</Layout>
			{editVacationObj}
		</>
	);
}
