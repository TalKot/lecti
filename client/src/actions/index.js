import axios from 'axios';
import {
    FETCH_USER, FETCH_PURCHASE_GROUPS, FETCH_PAGE_COUNT,
    FETCH_CUSTOM_MADE_GROUPS, FETCH_SUGGESTIONS_PURCHES_GROUPS,
    FETCH_PURCHASE_GROUPS_BY_SEARCH
} from './types';

//fetching user when application load
export const fetchUser = () => async dispatch => {
    const res = await axios.get('/api/current_user');
    dispatch({ type: FETCH_USER, payload: res.data });
};

//handle payments from stripe.js API
export const handleToken = (token, amount) => async dispatch => {
    const options = {
        token,
        amount
    };
    const res = await axios.post('/api/stripe', options);
    dispatch({ type: FETCH_USER, payload: res.data });
};

//fetch purchaseGropus by type
export const fetchPurchaseGroups = (type, page) => async dispatch => {
    let res = await axios.get(`/api/purchaseGroup/getgroup/type/${type}?page=${page}`);
    dispatch({ type: FETCH_PURCHASE_GROUPS, payload: res.data.purchaseGroup });
    dispatch({ type: FETCH_PAGE_COUNT, payload: res.data.count });
};

//fetch Suggestions purchase Groupu
export const fetchSuggestionsPurchaseGroups = () => async dispatch => {
    const res = await axios.get(`/api/purchaseGroup/getsuggestions/`);
    dispatch({ type: FETCH_SUGGESTIONS_PURCHES_GROUPS, payload: res.data });
};

// buy purchase group
export const onAddPurchaseGroup = (purchaseGroupID, amount) => async dispatch => {

    let options = {
        purchaseGroupID,
        amount
    };

    let response = {
        result: true,
        response: ''
    };


    await axios.post(`/api/purchaseGroup/buy/`, options)
        .then(res => {
            dispatch({ type: FETCH_PURCHASE_GROUPS, payload: res.data });
            return axios.get(`/api/purchaseGroup/getgroup/id/${purchaseGroupID}`);
        })
        .then(res => {
            // dispatch({ type: FETCH_PURCHASE_GROUPS, payload: res.data });
            return axios.get('/api/current_user');
        }).then(res => {
            dispatch({ type: FETCH_USER, payload: res.data });
        })
        .catch(err => {
            response = {
                result: false,
                response: err.response.data.error

            }
            return response;
        });

    return response;

    // const res = await axios.post(`/api/purchaseGroup/buy/`, options);
    // dispatch({type: FETCH_PURCHASE_GROUPS, payload: res.data});
    //
    // const resData = await axios.get(`/api/purchaseGroup/getgroup/id/${purchaseGroupID}`);
    // dispatch({type: FETCH_PURCHASE_GROUPS, payload: resData.data});
    //
    // const resUser = await axios.get('/api/current_user');
    // dispatch({type: FETCH_USER, payload: resUser.data});
};

// buy purchase group to cart
export const onAddPurchaseGroupToCart = (purchaseGroupID, amount) => async dispatch => {

    let options = {
        purchaseGroupID,
        amount
    };

    let response = {
        result: true,
        response: ''
    };


    axios.post(`/api/cart/add/`, options)
        .then(res => {
            dispatch({ type: FETCH_USER, payload: res.data });
        })
        .catch(err => {
            response = {
                result: false,
                response: err.response.data.error

            }
            return response;
        });

    return response
};

// fetch custom purchase group recommended per user
export const fetchCustomPurchaseGroups = () => async dispatch => {
    const res = await axios.get('/api/purchaseGroup/getgroup/custom/');
    dispatch({ type: FETCH_CUSTOM_MADE_GROUPS, payload: res.data });
};

//add purchase group from form data
export const createNewPurchaseGroup = (values, isSeller, history) => async dispatch => {
    const { data } = await axios.post('/api/create/purchasegroup', values);
    isSeller ? history.push(`/purchasegroup/${data._id}`) : history.push(`/suggestions/${data._id}`);
};
//fetch purchaseGroups by type
export const fetchPurchaseGroupsBySearch = search => async dispatch => {
    const res = await axios.get(`/api/purchaseGroup/search/${search}/`);
    dispatch({ type: FETCH_PURCHASE_GROUPS, payload: res.data });
};

//fetch purchaseGroups by type
export const searchActionPreform = (search, history) => async dispatch => {
    history.push(`/purchasegroups/others/`);
    if (search) {
        const res = await axios.get(`/api/purchaseGroup/search/${search}/`);
        const options = {
            data :res.data,
            searchValue:search
        }
        dispatch({ type: FETCH_PURCHASE_GROUPS_BY_SEARCH, payload: options });
    }
};
