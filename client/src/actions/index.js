import axios from 'axios';
import {FETCH_USER, FETCH_PAGE, FETCH_ALL_PAGES} from './types';

// fetch current user data
export const fetchUser = () => async dispatch => {
    const res = await axios.get('/api/current-user');
    dispatch({type: FETCH_USER, payload: res.data});
};

// fetch all the titles
export const fetchAllPages = () => async dispatch => {
    const res = await axios.get('/api/pages');
    console.log("in fetchPages", res.data);
    dispatch({type: FETCH_ALL_PAGES, payload: res.data});
};

export const fetchPage = (pageId) => async dispatch => {
    const path = '/api/page?pageId=' + pageId;
    const res = await axios.get(path);
    // console.log("in fetch SINGLE Page", res);
    dispatch({type: FETCH_PAGE, payload: res.data});
};

