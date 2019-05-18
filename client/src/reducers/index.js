import {combineReducers} from 'redux';
import authReducer from './authReducer';
import pageReducer from './pageReducer';
import allPagesReducer from './allPagesReducer';

export default combineReducers({
    // link the reducers to a global piece of state
    auth: authReducer,
    page: pageReducer,
    allPages: allPagesReducer
})
