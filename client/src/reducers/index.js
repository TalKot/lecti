import {combineReducers} from 'redux';
import authReducer from './authReducer';
import purchaseGroupsReducer from './purchaseGroupsReducer';

export default combineReducers({
    auth: authReducer,
    purchaseGroups: purchaseGroupsReducer
});
