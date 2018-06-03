import * as mongoose from 'mongoose';
import * as _ from 'lodash';

const User = mongoose.model('users');
const PurchaseGroup = mongoose.model('purchaseGroups');
const liveEmailNotificationTemplte = require('../services/emailsNotifications/emailTemplates/livePurchaseGroupTemplate')
const newSellerTemplte = require('../services/emailsNotifications/emailTemplates/newSellerTemplate')
const Mailer = require('../services/emailsNotifications/livePurchaseGroupsMailer');

export default class UserManager {
    /****** will be user as singelton*****/
    private static _instance;

    public static get Instance() {
        return this._instance || (this._instance = new this());
    }

    /************************************/

    getUser =  async (userID: string) => {
        const user = await User.findById(userID)
            .populate({
                path: 'purchaseGroupsSell',
                model: 'purchaseGroups'
            });

        return user ? user : null;
    }

    getUserSeller= async (userID: string) =>{
        const user = await User.findById(userID, {
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
    }

    getPurchaseGroupsBoughtByUserID = async (userID: string) => {
        const {purchaseGroupsBought} = await User.findById(userID);
        return purchaseGroupsBought ? purchaseGroupsBought : null;
    }


     addPurchaseGroupToUser = async (purchaseGroup, amount: number, userID: string) =>{

        const cost = amount * purchaseGroup.priceForGroup;

        await User.findByIdAndUpdate(userID, {
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
    }

    updatePurchaseGroupToUser = async (purchaseGroupID, price: number, amount: number, userID: string) => {

        //fetch user from DB
        let user = await this.getUser(userID);
        // fetch purchase group to change from list
        const purchaseGroupToChange = _.find(user.purchaseGroupsBought, obj => {
            return obj.purchaseGroup.toString() === purchaseGroupID;
        });
        //update values
        purchaseGroupToChange.amount += amount;
        const cost = amount * price;
        user.credits -= cost;
        //save record to DB
        await user.save();
    }

     removePurchaseGroupFromUser = async (userID, purchaseGroupID, amount, price) => {
        amount = Number(amount);
        const cost = amount * price;

        await User.findByIdAndUpdate(userID, {
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
    }

    takeSuggestionsPurchaseGroupOwnershi = async (suggestionID, userID) => {

        await User.findByIdAndUpdate(userID, {
            $push: {
                purchaseGroupsSell: suggestionID
            }
        });
    }

     notifyClientsOnClosedPurchaseGroup = async(purchaseGroup) => {
        let clientList = purchaseGroup.potentialBuyers.map(client => client.user);
        clientList = await User.find({
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
            await mailer.send();
        } catch (e) {
            console.error(e);
            throw e;
        }
    }


    alertAdminsNewSellerRequest = async (userID, body) => {
        try {
            const emailsToNotify = ['talkot123@gmail.com', 'lougassi@gmail.com','Lecti99@gmail.com'];
            const message = `New Seller Request!`;

            const newSellerRequest = {
                body: message,
                subject: message,
                title: message,
                mailingList: emailsToNotify
            };

            const mailer = new Mailer(newSellerRequest, newSellerTemplte(body));
            await mailer.send();
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

}