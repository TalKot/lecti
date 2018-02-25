import baseStore from './baseStore';

export default class storeA extends baseStore {

    public notify = (message) => {
        console.log(`store A! - ${message}`);
    }

}
