import { FETCH_PURCHES_GROUPS } from '../actions/types';


export default function(state = [], action) {
    switch (action.type) {
        case FETCH_PURCHES_GROUPS:
            return action.payload;
        default:
            return state;
    }
}
