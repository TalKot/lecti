import { FETCH_PURCHASE_GROUPS } from '../actions/types';


export default function(state = [], action) {
    switch (action.type) {
        case FETCH_PURCHASE_GROUPS:
            return action.payload;
        default:
            return state;
    }
}
