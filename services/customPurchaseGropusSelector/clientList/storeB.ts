import baseStore from './baseStore';

export default class storeB extends baseStore {

    public notify = (message) => {
        console.log(`store B! - ${message}`);
    }
}
