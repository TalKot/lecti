import baseStore from './baseStore';

export default class storeA extends baseStore {

    public  readonly STORE: string = "store A";

    public notify = (message) => {
        console.log(`${this.STORE}! - ${message}`);
    }

}
