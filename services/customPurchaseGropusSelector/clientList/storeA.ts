import baseStore from './baseStore';

export default class storeA extends baseStore {

    public  readonly STORE: string = "store A";
    public readonly mailingList: string[] = ['tkot@vidazoo.com'] ;

    // public notify = async (message) => {
    //     console.log(`${this.STORE}! - to the following mailing list ${this.mailingList}`);
    // }
}
