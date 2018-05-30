import baseStore from './baseStore';

export default class storeB extends baseStore {

    public  readonly STORE: string = "store B";
    public  readonly mailingList: string[] = ['talkot123@gmail.com', 'lougassi@gmail.com','Lecti99@gmail.com'] ;

    public notify = async (message,purchaseGroupsKeyBySubType) => {
        console.log(`${this.STORE}! - to the following mailing list ${this.mailingList}`);
    }
}
