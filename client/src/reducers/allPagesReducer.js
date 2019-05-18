import {FETCH_ALL_PAGES} from "../actions/types";

export default function (state = [], action) {
	switch (action.type) {
		case FETCH_ALL_PAGES:
			return action.payload;
		default:
			return state;
	}
}