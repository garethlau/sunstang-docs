import {combineReducers} from 'redux';
import authReducer from './authReducer';
import pagesReducer from './pagesReducer';

export default combineReducers({
    // link the reducers to a global piece of state
    auth: authReducer,
    pages: pagesReducer
})
