import axios from 'axios';
import {FETCH_USER, FETCH_PURCHASE_GROUPS, FETCH_CUSTOM_MADE_GROUPS,FETCH_SUGGESTIONS_PURCHES_GROUPS} from './types';

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
    dispatch({type: FETCH_PURCHASE_GROUPS, payload: res.data});
};

//fetch purchaseGropus by type
export const fetchSuggestionsPurchaseGroups = () => async dispatch => {
    const res = await axios.get(`/api/purchaseGroup/getsuggestions/`);
    dispatch({type: FETCH_SUGGESTIONS_PURCHES_GROUPS, payload: res.data});
};

//fetch purchaseGropus by type
export const fetchPurchaseGroupsBySearch = (search) => async dispatch => {
    const res = await axios.get(`/api/purchaseGroup/search/${search}/`);
    dispatch({type: FETCH_PURCHASE_GROUPS, payload: res.data});
};

// buy purchase group
export const onAddPurchaseGroup = (purchaseGroupID, amount) => async dispatch => {
    let options = {
        purchaseGroupID,
        amount
    };

    const res = await axios.post(`/api/purchaseGroup/buy/`, options);
    dispatch({type: FETCH_PURCHASE_GROUPS, payload: res.data});

    const resData = await axios.get(`/api/purchaseGroup/getgroup/id/${purchaseGroupID}`);
    dispatch({type: FETCH_PURCHASE_GROUPS, payload: resData.data});

    const resUser = await axios.get('/api/current_user');
    dispatch({type: FETCH_USER, payload: resUser.data});
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

// //submit a survey
// export const submitSurvey = (values, history) => async dispatch => {
//     const res = await axios.post('/api/surveys', values);
//     history.push('/surveys');
//     dispatch({type: FETCH_USER, payload: res.data});
// };

//submit become a seller form
export const becomeSellerSubmit = (values) => async dispatch => {
    const res = await axios.post('/api/becomeseller', values);
    dispatch({type: FETCH_USER, payload: res.data});
};

//add purchase group from form data
export const createNewPurchaseGroup = (values,history) => async dispatch => {
    const {data} = await axios.post('/api/create/purchasegroup', values);
    history.push(`/purchasegroup/${data._id}`);
};
