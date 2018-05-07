import {combineReducers} from 'redux';
import {reducer as reduxForm} from 'redux-form';
import authReducer from './authReducer';
import purchaseGroupsReducer from './purchaseGroupsReducer';
import customPurchaseGroupsReducer from './customPurchaseGroupsReducer';
import purchaseGroupsSuggestionsReducer from './purchaseGroupsSuggestionsReducer';
import purchaseGroupsPageCountReducer from './purchaseGroupsPageCountReducer';
import searchValue from './searchReducer';

export default combineReducers({
    auth: authReducer,
    purchaseGroups: purchaseGroupsReducer,
    customPurchaseGroups: customPurchaseGroupsReducer,
    suggestionsPurchaseGroups: purchaseGroupsSuggestionsReducer,
    pageCount : purchaseGroupsPageCountReducer,
    searchValue: searchValue.searchValue,
    purchasGroupsBySearch: searchValue.data,
    form: reduxForm
});
