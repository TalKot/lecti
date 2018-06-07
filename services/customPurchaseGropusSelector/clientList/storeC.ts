import baseStore from './baseStore';
import {groupC} from '../../../config/keys';

export default class storeC extends baseStore {
    public readonly STORE: string = "store C";
    public  readonly mailingList: string[] = groupC.split(',');


    public notify = async (message,purchaseGroupsKeyBySubType) => {
        console.log(`${this.STORE}! - to the following mailing list ${this.mailingList}`);
    }
}
