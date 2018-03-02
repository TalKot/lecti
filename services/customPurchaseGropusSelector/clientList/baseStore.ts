const Mailer = require('../../emailsNotifications/customPurchaseGroupsMailer');
const surveyTemplate = require('../../emailsNotifications/emailTemplates/customPurchaseGroupTemplate');

export default abstract class BaseStore {

    public abstract readonly STORE: string;
    public abstract readonly mailingList: string[] = ['talkot123@gmail.com', 'lougassi@gmail.com'] ;

    public notify = async (message) => {

        const customPurchaseGroup = {
            body: message,
            subject: 'Custom Purchase Groups Chose This Results',
            title: 'Custom Purchase Groups Chose This',
            mailingList : this.mailingList
        };

        const mailer = new Mailer(customPurchaseGroup, surveyTemplate(message));
        await mailer.send();

        console.log(`store base ${this.STORE} called`)
    }

}
