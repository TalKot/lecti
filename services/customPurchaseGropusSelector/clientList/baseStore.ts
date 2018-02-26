export default abstract class BaseStore {

    public abstract readonly STORE: string;

    public notify = (message) => {
        //TODO: SENDING EMAIL TO CLIENT-STORE
        console.log(`store base ${this.STORE} - ${message}`)
    }

}
