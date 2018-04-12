import PurchaseGroupManager from '../managers/purchaseGroupManager';
import UserManager from '../managers/userManager';
import httpResponse from '../common/httpResponse'
import CustomPurchaseGroupSelector from "../services/customPurchaseGropusSelector/customPurchaseGropusSelector";
import * as _ from 'lodash';

export default class PurchaseGroupController {

    /****** will be user as singelton*****/
    private static _instance;

    public static get Instance() {
        return this._instance || (this._instance = new this());
    }
    /************************************/


    async getAllPurchaseGroups(res) {
        try {
            const PurchaseGroupManagerInstance = PurchaseGroupManager.Instance;
            let purchaseGroups = await PurchaseGroupManagerInstance.getAllPurchaseGroups();
            purchaseGroups ? httpResponse.sendOk(res, purchaseGroups) : httpResponse.sendError(res);
        }
        catch (e) {
            httpResponse.sendError(res, e);
        }
    }

    async getPurchaseGroupById(res, id: string) {
        try {
            const PurchaseGroupManagerInstance = PurchaseGroupManager.Instance;
            let purchaseGroups = await PurchaseGroupManagerInstance.getPurchaseGroupById(id);
            purchaseGroups ? httpResponse.sendOk(res, purchaseGroups) : httpResponse.sendError(res);
        }
        catch (e) {
            httpResponse.sendError(res, e);
        }
    }

    async getPurchaseGroupByType(res, type: string, page: string) {
        try {
            const PurchaseGroupManagerInstance = PurchaseGroupManager.Instance;
            let purchaseGroups = await PurchaseGroupManagerInstance.getPurchaseGroupsByType(type, page);
            purchaseGroups ? httpResponse.sendOk(res, purchaseGroups) : httpResponse.sendError(res);
        }
        catch (e) {
            httpResponse.sendError(res, e);
        }
    }

    async getSuggestionsPurchaseGroups(res) {
        try {
            const PurchaseGroupManagerInstance = PurchaseGroupManager.Instance;
            let purchaseGroups = await PurchaseGroupManagerInstance.getSuggestionsPurchaseGroups();
            purchaseGroups ? httpResponse.sendOk(res, purchaseGroups) : httpResponse.sendError(res);
        }
        catch (e) {
            httpResponse.sendError(res, e);
        }
    }

    async getSuggestionsPurchaseGroupByID(res, ID) {
        try {
            const PurchaseGroupManagerInstance = PurchaseGroupManager.Instance;
            let purchaseGroup = await PurchaseGroupManagerInstance.getSuggestionsPurchaseGroupByID(ID);
            purchaseGroup ? httpResponse.sendOk(res, purchaseGroup) : httpResponse.sendError(res);
        }
        catch (e) {
            httpResponse.sendError(res, e);
        }
    }

    async getPurchaseGroupsByUserId(res, userId: string) {
        try {
            const PurchaseGroupManagerInstance = PurchaseGroupManager.Instance;
            let purchaseGroups = await PurchaseGroupManagerInstance.getPurchaseGroupsByUserId(userId);
            purchaseGroups ? httpResponse.sendOk(res, purchaseGroups) : httpResponse.sendError(res);
        }
        catch (e) {
            httpResponse.sendError(res, e);
        }
    }

    async getSalesPurchaseGroupsByUserId(res, userId: string) {
        try {
            const PurchaseGroupManagerInstance = PurchaseGroupManager.Instance;
            let purchaseGroups = await PurchaseGroupManagerInstance.getSalesPurchaseGroupsByUserId(userId);
            purchaseGroups ? httpResponse.sendOk(res, purchaseGroups) : httpResponse.sendError(res);
        }
        catch (e) {
            httpResponse.sendError(res, e);
        }
    }

    async buyPurchaseGroup(res, purchaseGroupID: string, amount: number, userID: string) {
        try {
            amount = Number(amount);
            let purchaseGroupShouldClose: boolean = false;

            const PurchaseGroupManagerInstance = PurchaseGroupManager.Instance;
            let UserManagerInstance = UserManager.Instance;

            const purchaseGroup = await PurchaseGroupManagerInstance.getPurchaseGroupById(purchaseGroupID);

            // purchase group validation tests
            if (purchaseGroup) {

                // check that group is active
                if (!purchaseGroup.isActive) {
                    const error: string = 'purchaseGroup is not available';
                    httpResponse.sendError(res, error);
                    throw new Error(error)

                }

                //check available amount for client to purchase
                if (purchaseGroup.totalAmount < amount) {
                    const error: string = 'Amount is not available for this purchase group';
                    httpResponse.sendError(res, error);
                    throw new Error(error)
                }


                //check available amount left for client to purchase
                if (purchaseGroup.totalAmount < purchaseGroup.sales + amount) {
                    const error: string = 'cannot buy this amount';
                    httpResponse.sendError(res, error);
                    throw new Error(error)
                }

                //check if purchase group should close after the udpate
                if (purchaseGroup.totalAmount === purchaseGroup.sales + amount) {
                    purchaseGroupShouldClose = true;
                }
            }

            //validate that purchase group is new
            const purchaseGroupsBought = await UserManagerInstance.getPurchaseGroupsBoughtByUserID(userID);
            let userPurchaseGroupBoughtList = _.keyBy(purchaseGroupsBought, obj =>
                obj.purchaseGroup.toString()
            );

            if (userPurchaseGroupBoughtList[purchaseGroupID]) {
                //purchase group already in this user list
                // in user - need to update user credits and purchaseGroupsBought amount
                // in purchase group - need to update sales and potentialBuyers
                await Promise.all([
                    UserManagerInstance.updatePurchaseGroupToUser(purchaseGroupID, purchaseGroup.priceForGroup, amount, userID),
                    PurchaseGroupManagerInstance.updateUserOnPurchaseGroup(purchaseGroupID, purchaseGroup.priceForGroup, amount, userID)
                ])

            } else {
                //new purchase group for this user
                // update records values
                //TODO - SHOULD WORK BELOW?
                await Promise.all([
                    PurchaseGroupManagerInstance.addUserToPurchaseGroup(purchaseGroup.id, amount, userID),
                    UserManagerInstance.addPurchaseGroupToUser(purchaseGroup, amount, userID)
                ]);
            }
            // check and update purchase group active status if needed
            if (purchaseGroupShouldClose) {
                await PurchaseGroupManagerInstance.updatePurchaseGroupById(purchaseGroup.id, {isActive: false})
            }
            //TODO - WE NEED THIS?
            //return values
            await this.getPurchaseGroupByType(res, purchaseGroup.type, "1");
        }
        catch (e) {
            httpResponse.sendError(res, e);
        }
    }

    async getCustomPurchaseGroupsByUserId(res, userId: string) {
        try {
            const customPurchaseGroupSelector = CustomPurchaseGroupSelector.Instance;
            const type = await customPurchaseGroupSelector.selectCustomPurchaseGroupsTypeForUser(userId);
            const RETURN_ARRAY_AMOUNT: number = 3;

            const PurchaseGroupManagerInstance = PurchaseGroupManager.Instance;
            let purchaseGroups;

            if(type === 'cheapest'){
                purchaseGroups = await PurchaseGroupManagerInstance.getPurchaseGroupsByType(null, "1", RETURN_ARRAY_AMOUNT);
                purchaseGroups ? httpResponse.sendOk(res, purchaseGroups) : httpResponse.sendError(res);
            }else {
                purchaseGroups = await PurchaseGroupManagerInstance.getPurchaseGroupsByType(type, "1", RETURN_ARRAY_AMOUNT);
                purchaseGroups ? httpResponse.sendOk(res, purchaseGroups) : httpResponse.sendError(res);

            }
        } catch (e) {
            httpResponse.sendError(res, e);
        }
    }

    async removePurchaseGroupsFromUser(res, userID, purchaseGroupToRemove, amount, price) {
        try {
            const PurchaseGroupManagerInstance = PurchaseGroupManager.Instance;
            let UserManagerInstance = UserManager.Instance;

            // in user - update credits & purchaseGroupsBought
            // in purchase group - sales & potentialBuyers
            await Promise.all([
                PurchaseGroupManagerInstance.removeUserFromPurchaseGroup(userID, purchaseGroupToRemove, amount),
                UserManagerInstance.removePurchaseGroupFromUser(userID, purchaseGroupToRemove, amount, price)
            ]);
            return await this.getPurchaseGroupsByUserId(res, userID);
        }
        catch (e) {
            httpResponse.sendError(res, e);
        }
    }

    async removeSellPurchaseGroupsFromUser(res, userID, purchaseGroupToRemove) {
        try {
            const PurchaseGroupManagerInstance = PurchaseGroupManager.Instance;
            await PurchaseGroupManagerInstance.removeSellPurchaseGroupsFromUser(userID, purchaseGroupToRemove)
            return await this.getPurchaseGroupsByUserId(res, userID);
        }
        catch (e) {
            httpResponse.sendError(res, e);
        }
    }

    async purchaseGroupsViewed(res, userID, purchaseGroupsViewed) {
        try {
            const PurchaseGroupManagerInstance = PurchaseGroupManager.Instance;
            await PurchaseGroupManagerInstance.purchaseGroupsViewed(userID, purchaseGroupsViewed);
            return;
        }
        catch (e) {
            httpResponse.sendError(res, e);
        }
    }

    async searchPurchaseGroup(res, searchValue) {
        try {
            const PurchaseGroupManagerInstance = PurchaseGroupManager.Instance;
            let purchaseGroups = await PurchaseGroupManagerInstance.searchPurchaseGroup(searchValue);
            purchaseGroups ? httpResponse.sendOk(res, purchaseGroups) : httpResponse.sendError(res);
        }
        catch (e) {
            httpResponse.sendError(res, e);
        }
    }

    async typeOnNotRelevantList(res, userID, type, status) {
        try {
            const PurchaseGroupManagerInstance = PurchaseGroupManager.Instance;

            if (status) {
                //add purchase group type to not relevant list
                await PurchaseGroupManagerInstance.addTypeToNotRelevantList(userID, type);
            } else {
                //remove purchase group type to not relevant list
                await PurchaseGroupManagerInstance.removeTypeToNotRelevantList(userID, type);
            }
        }
        catch (e) {
            httpResponse.sendError(res, e);
        }
    }

    async increaseAttemptsAndCheck(res, userID, type) {
        try {
            const PurchaseGroupManagerInstance = PurchaseGroupManager.Instance;
            await PurchaseGroupManagerInstance.increaseAttemptsAndCheck(userID, type);
            httpResponse.sendOk(res)
        }
        catch (e) {
            httpResponse.sendError(res, e);
        }
    }

    async createPurchaseGroup(res, data, userID) {
        try {
            const PurchaseGroupManagerInstance = PurchaseGroupManager.Instance;
            let UserManagerInstance = UserManager.Instance;

            const user = await UserManagerInstance.getUser(userID);
            let purchaseGroup = {};

            if (user.isSeller) {
                //will create active purchase group because user type seller
                data.seller = userID;
                purchaseGroup = await PurchaseGroupManagerInstance.createPurchaseGroup(data);
                user.purchaseGroupsSell.push(purchaseGroup['_id']);
                await user.save();

            } else {
                //will create suggestion purchase group because user ype is buyer
                data.isSuggestion = true;
                purchaseGroup = await PurchaseGroupManagerInstance.createSuggestionsPurchaseGroup(data);
            }
            purchaseGroup ? httpResponse.sendOk(res, purchaseGroup) : httpResponse.sendError(res);
        }
        catch (e) {
            httpResponse.sendError(res, e);
        }
    }

    async takeSuggestionsPurchaseGroupOwnership(res, suggestionID, userID) {
        try {
            let UserManagerInstance = UserManager.Instance;
            const PurchaseGroupManagerInstance = PurchaseGroupManager.Instance;

            await Promise.all([
                UserManagerInstance.takeSuggestionsPurchaseGroupOwnership(suggestionID, userID),
                PurchaseGroupManagerInstance.takeSuggestionsPurchaseGroupOwnership(suggestionID, userID)
            ]);
            httpResponse.sendOk(res);
        }
        catch (e) {
            httpResponse.sendError(res, e);
        }
    }

    async joinSuggestionGroup(res, groupID, userID){
        try {
            const PurchaseGroupManagerInstance = PurchaseGroupManager.Instance;
            PurchaseGroupManagerInstance.joinSuggestionGroup(groupID, userID);
            httpResponse.sendOk(res);
        }
        catch (e) {
            httpResponse.sendError(res, e);
        }
    }

    async leaveSuggestionGroup(res, groupID, userID){
        try {
            const PurchaseGroupManagerInstance = PurchaseGroupManager.Instance;
            PurchaseGroupManagerInstance.leaveSuggestionGroup(groupID, userID);
            httpResponse.sendOk(res);
        }
        catch (e) {
            httpResponse.sendError(res, e);
        }
    }
}