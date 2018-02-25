import {combineReducers} from 'redux';
import {reducer as reduxForm} from 'redux-form';
import authReducer from './authReducer';
import purchaseGroupsReducer from './purchaseGroupsReducer';
import customPurchaseGroupsReducer from './customPurchaseGroupsReducer';

export default combineReducers({
    auth: authReducer,
    purchaseGroups: purchaseGroupsReducer,
    customPurchaseGroups: customPurchaseGroupsReducer,
    form: reduxForm
});
