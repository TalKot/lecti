"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Mailer = require('../../emailsNotifications/customPurchaseGroupsMailer');
const surveyTemplate = require('../../emailsNotifications/emailTemplates/customPurchaseGroupTemplate');
const PurchaseGroup = require('../../../managers/purchaseGroupManager');
class BaseStore {
    constructor() {
        this.mailingList = ['talkot123@gmail.com', 'lougassi@gmail.com'];
        this.notify = (message, purchaseGroupsByType) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const customPurchaseGroup = {
                body: message,
                subject: 'Custom Purchase Groups Chose This Results',
                title: 'Custom Purchase Groups Chose This',
                mailingList: this.mailingList
            };
            const mailer = new Mailer(customPurchaseGroup, surveyTemplate(message, purchaseGroupsByType));
            yield mailer.send();
            console.log(`store base ${this.STORE} called`);
        });
    }
}
exports.default = BaseStore;
//# sourceMappingURL=baseStore.js.map