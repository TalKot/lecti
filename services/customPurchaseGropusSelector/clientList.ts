import storeA from './clientList/storeA'
import storeB from './clientList/storeB'
import storeC from './clientList/storeC'

export = {
    storeA: (message,purchaseGroupsKeyBySubType) => {
        let a = new storeA();
        a.notify(message,purchaseGroupsKeyBySubType);
    },
    storeB: (message,purchaseGroupsKeyBySubType) => {
        let a = new storeB();
        a.notify(message,purchaseGroupsKeyBySubType);
    },
    storeC: (message,purchaseGroupsKeyBySubType) => {
        let a = new storeC();
        a.notify(message,purchaseGroupsKeyBySubType);
    }
}