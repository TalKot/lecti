import { FETCH_CUSTOM_MADE_GROUPS } from '../actions/types';


export default function(state = [], action) {
    switch (action.type) {
        case FETCH_CUSTOM_MADE_GROUPS:
            return action.payload;
        default:
            return state;
    }
}
