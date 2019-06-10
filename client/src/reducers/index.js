import {combineReducers} from 'redux';
import userReducer from './userReducer';
import pageReducer from './pageReducer';
import allPagesReducer from './allPagesReducer';

export default combineReducers({
    // link the reducers to a global piece of state
    user: userReducer,
    page: pageReducer,
    allPages: allPagesReducer
})
