import { FETCH_PAGE_COUNT } from '../actions/types';


export default function(state = 0, action) {
    switch (action.type) {
        case FETCH_PAGE_COUNT:
            return action.payload;
        default:
            return state;
    }
}
