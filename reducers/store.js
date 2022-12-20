import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import userReducer from './user';
import vacationReducer from './vacation';

const rootReducer = combineReducers({
	user: userReducer,
	vacations: vacationReducer
});

export const store = createStore(
	rootReducer,
	applyMiddleware(thunk)
);
