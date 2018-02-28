import axios from 'axios';
import {FETCH_USER, FETCH_PURCHES_GROUPS, FETCH_CUSTOM_MADE_GROUPS} from './types';

//fetching user when application load
export const fetchUser = () => async dispatch => {
    const res = await axios.get('/api/current_user');
    dispatch({type: FETCH_USER, payload: res.data});
};

//handle payments from stripe.js API
export const handleToken = (token, amount) => async dispatch => {
    const options = {
        token,
        amount
    };
    const res = await axios.post('/api/stripe', options);
    dispatch({type: FETCH_USER, payload: res.data});
};

//fetch purchaseGropus by type
export const fetchPurchaseGroups = (type) => async dispatch => {
    const res = await axios.get(`/api/purchaseGroup/getgroup/type/${type}`);
    dispatch({type: FETCH_PURCHES_GROUPS, payload: res.data});
};

// buy purchase group
export const onAddPurchaseGroup = (purchaseGroupID, amount) => async dispatch => {
    let options = {
        purchaseGroupID,
        amount
    };
    const res = await axios.post(`/api/purchaseGroup/buy/`, options);
    dispatch({type: FETCH_USER, payload: res.data});
};

// buy purchase group to cart
export const onAddPurchaseGroupToCart = (purchaseGroupID, amount) => async dispatch => {
    let options = {
        purchaseGroupID,
        amount
    };
    const res = await axios.post(`/api/cart/add/`, options);
    dispatch({type: FETCH_USER, payload: res.data});
};

// fetch custom purchase group recommended per user
export const fetchCustomPurchaseGroups = (purchaseGroupID, amount) => async dispatch => {
    const res = await axios.get('/api/purchaseGroup/getgroup/custom/');
    dispatch({type: FETCH_CUSTOM_MADE_GROUPS, payload: res.data});
};

//submit a survey
export const submitSurvey = (values, history) => async dispatch => {
    const res = await axios.post('/api/surveys', values);
    history.push('/surveys');
    dispatch({type: FETCH_USER, payload: res.data});
};
//submit become a seller form
export const becomeSellerSubmit = (values) => async dispatch => {
    const res = await axios.post('/api/becomeseller', values);
    // history.push('/surveys');
    dispatch({type: FETCH_USER, payload: res.data});
};
