import baseStore from './baseStore';
import {groupB} from '../../../config/keys';

export default class storeB extends baseStore {

    public  readonly STORE: string = "store B";
    public  readonly mailingList: string[] = groupB.split(',') ;

    public notify = async (message,purchaseGroupsKeyBySubType) => {
        console.log(`${this.STORE}! - to the following mailing list ${this.mailingList}`);
    }
}
