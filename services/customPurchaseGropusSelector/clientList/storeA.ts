import baseStore from './baseStore';
import {groupA} from '../../../config/keys';

export default class storeA extends baseStore {

    public  readonly STORE: string = "store A";
    public readonly mailingList: string[] = groupA ;

    // public notify = async (message) => {
    //     console.log(`${this.STORE}! - to the following mailing list ${this.mailingList}`);
    // }
}
