import {combineReducers} from 'redux';
import authReducer from './authReducer';

export default combineReducers({
    // link the reducers to a global piece of state
    auth: authReducer
})
