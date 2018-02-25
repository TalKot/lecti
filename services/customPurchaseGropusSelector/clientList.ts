import storeA from './clientList/storeA'
import storeB from './clientList/storeB'
import storeC from './clientList/storeC'

export = {
    storeA: (message) => {
        let a = new storeA();
        a.notify(message);
    },
    storeB: (message) => {
        let a = new storeB();
        a.notify(message);
    },
    storeC: (message) => {
        let a = new storeC();
        a.notify(message);
    }
}