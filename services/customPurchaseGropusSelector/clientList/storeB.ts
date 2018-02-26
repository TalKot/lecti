import baseStore from './baseStore';

export default class storeB extends baseStore {

    public  readonly STORE: string = "store B";

    public notify = (message) => {
        console.log(`${this.STORE}! - ${message}`);
    }
}
