"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose = require("mongoose");
const _ = require("lodash");
const User = mongoose.model('users');
const PurchaseGroup = mongoose.model('purchaseGroups');
const liveEmailNotificationTemplte = require('../services/emailsNotifications/emailTemplates/livePurchaseGroupTemplate');
const newSellerTemplte = require('../services/emailsNotifications/emailTemplates/newSellerTemplate');
const Mailer = require('../services/emailsNotifications/livePurchaseGroupsMailer');
class UserManager {
    constructor() {
        /************************************/
        this.getUser = (userID) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const user = yield User.findById(userID)
                .populate({
                path: 'purchaseGroupsSell',
                model: 'purchaseGroups'
            });
            return user ? user : null;
        });
        this.getUserSeller = (userID) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const user = yield User.findById(userID, {
                comments: 1,
                displayName: 1,
                email: 1,
                gender: 1,
                photoURL: 1,
                purchaseGroupsSell: 1
            })
                .populate({
                path: 'purchaseGroupsSell',
                model: 'purchaseGroups'
            })
                .populate({
                path: 'comments',
                model: 'comments',
                populate: {
                    path: 'user',
                    model: 'users',
                    select: ["displayName", "_id"]
                }
            });
            return user ? user : null;
        });
        this.getPurchaseGroupsBoughtByUserID = (userID) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { purchaseGroupsBought } = yield User.findById(userID);
            return purchaseGroupsBought ? purchaseGroupsBought : null;
        });
        this.addPurchaseGroupToUser = (purchaseGroup, amount, userID) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const cost = amount * purchaseGroup.priceForGroup;
            yield User.findByIdAndUpdate(userID, {
                $push: {
                    purchaseGroupsBought: {
                        purchaseGroup: purchaseGroup.id,
                        amount: amount,
                        time: Date.now()
                    }
                },
                $inc: {
                    credits: -cost
                }
            });
        });
        this.updatePurchaseGroupToUser = (purchaseGroupID, price, amount, userID) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            //fetch user from DB
            let user = yield this.getUser(userID);
            // fetch purchase group to change from list
            const purchaseGroupToChange = _.find(user.purchaseGroupsBought, obj => {
                return obj.purchaseGroup.toString() === purchaseGroupID;
            });
            //update values
            purchaseGroupToChange.amount += amount;
            const cost = amount * price;
            user.credits -= cost;
            //save record to DB
            yield user.save();
        });
        this.removePurchaseGroupFromUser = (userID, purchaseGroupID, amount, price) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            amount = Number(amount);
            const cost = amount * price;
            yield User.findByIdAndUpdate(userID, {
                $pull: {
                    purchaseGroupsBought: {
                        purchaseGroup: {
                            $in: [purchaseGroupID]
                        }
                    }
                },
                $inc: {
                    credits: cost
                }
            });
        });
        this.takeSuggestionsPurchaseGroupOwnershi = (suggestionID, userID) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield User.findByIdAndUpdate(userID, {
                $push: {
                    purchaseGroupsSell: suggestionID
                }
            });
        });
        this.notifyClientsOnClosedPurchaseGroup = (purchaseGroup) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            let clientList = purchaseGroup.potentialBuyers.map(client => client.user);
            clientList = yield User.find({
                _id: {
                    $in: clientList
                }
            });
            try {
                const emailsToNotify = clientList.map(obj => obj.email);
                const message = `Purchase Group - ${purchaseGroup.name} Is Now LIVE!`;
                const customPurchaseGroup = {
                    body: message,
                    subject: message,
                    title: message,
                    mailingList: emailsToNotify
                };
                const mailer = new Mailer(customPurchaseGroup, liveEmailNotificationTemplte(message, purchaseGroup.name, purchaseGroup.id));
                yield mailer.send();
            }
            catch (e) {
                console.error(e);
                throw e;
            }
        });
        this.alertAdminsNewSellerRequest = (userID, body) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const emailsToNotify = ['talkot123@gmail.com', 'lougassi@gmail.com', 'Lecti99@gmail.com'];
                const message = `New Seller Request!`;
                const newSellerRequest = {
                    body: message,
                    subject: message,
                    title: message,
                    mailingList: emailsToNotify
                };
                const mailer = new Mailer(newSellerRequest, newSellerTemplte(body));
                yield mailer.send();
            }
            catch (e) {
                console.error(e);
                throw e;
            }
        });
    }
    static get Instance() {
        return this._instance || (this._instance = new this());
    }
}
exports.default = UserManager;
//# sourceMappingURL=userManager.js.map