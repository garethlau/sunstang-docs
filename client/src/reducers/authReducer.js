import {FETCH_USER} from '../actions/types';

export default function(state = null, action) {
    switch(action.type) {
        case FETCH_USER:
            // determine what state the user is in
            // if no response, set it to false
            return action.load || false
        default:
            // by default, return null
            return state;
    }
}
