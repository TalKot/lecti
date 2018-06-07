const Mailer = require('../../emailsNotifications/customPurchaseGroupsMailer');
const surveyTemplate = require('../../emailsNotifications/emailTemplates/customPurchaseGroupTemplate');
const PurchaseGroup = require('../../../managers/purchaseGroupManager');
import {groupA} from '../../../config/keys';


export default abstract class BaseStore {

    public abstract readonly STORE: string;
    public abstract readonly mailingList = groupA;

    public notify = async (message, purchaseGroupsByType) => {

        const customPurchaseGroup = {
            body: message,
            subject: 'Custom Purchase Groups Chose This Results',
            title: 'Custom Purchase Groups Chose This',
            mailingList: this.mailingList.split(',')
        };

        const mailer = new Mailer(customPurchaseGroup, surveyTemplate(message, purchaseGroupsByType));
        await mailer.send();

        console.log(`store base ${this.STORE} called`)
    }

}
