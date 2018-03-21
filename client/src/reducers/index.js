import {combineReducers} from 'redux';
import {reducer as reduxForm} from 'redux-form';
import authReducer from './authReducer';
import purchaseGroupsReducer from './purchaseGroupsReducer';
import customPurchaseGroupsReducer from './customPurchaseGroupsReducer';
import purchaseGroupsSuggestionsReducer from './purchaseGroupsSuggestionsReducer';
import purchaseGroupsPageCountReducer from './purchaseGroupsPageCountReducer';

export default combineReducers({
    auth: authReducer,
    purchaseGroups: purchaseGroupsReducer,
    customPurchaseGroups: customPurchaseGroupsReducer,
    suggestionsPurchaseGroups: purchaseGroupsSuggestionsReducer,
    pageCount : purchaseGroupsPageCountReducer,
    form: reduxForm
});
