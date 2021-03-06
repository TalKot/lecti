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


    getAllPurchaseGroups = async res => {
        try {
            const PurchaseGroupManagerInstance = PurchaseGroupManager.Instance;
            let purchaseGroups = await PurchaseGroupManagerInstance.getAllPurchaseGroups();
            purchaseGroups ? httpResponse.sendOk(res, purchaseGroups) : httpResponse.sendError(res);
        }
        catch (e) {
            httpResponse.sendError(res, e);
        }
    };

    getPurchaseGroupById = async (res, id: string) => {
        try {
            const PurchaseGroupManagerInstance = PurchaseGroupManager.Instance;
            let purchaseGroups = await PurchaseGroupManagerInstance.getPurchaseGroupById(id);
            purchaseGroups ? httpResponse.sendOk(res, purchaseGroups) : httpResponse.sendError(res);
        }
        catch (e) {
            httpResponse.sendError(res, e);
        }
    };

    getPurchaseGroupByType = async (res, type: string, page: string) => {
        try {
            const PurchaseGroupManagerInstance = PurchaseGroupManager.Instance;
            let purchaseGroups = await PurchaseGroupManagerInstance.getPurchaseGroupsByType(type, page);
            purchaseGroups ? httpResponse.sendOk(res, purchaseGroups) : httpResponse.sendError(res);
        }
        catch (e) {
            httpResponse.sendError(res, e);
        }
    };

    getSuggestionsPurchaseGroups = async (res) => {
        try {
            const PurchaseGroupManagerInstance = PurchaseGroupManager.Instance;
            let purchaseGroups = await PurchaseGroupManagerInstance.getSuggestionsPurchaseGroups();
            purchaseGroups ? httpResponse.sendOk(res, purchaseGroups) : httpResponse.sendError(res);
        }
        catch (e) {
            httpResponse.sendError(res, e);
        }
    };

    getSuggestionsPurchaseGroupByID = async (res, ID) => {
        try {
            const PurchaseGroupManagerInstance = PurchaseGroupManager.Instance;
            let purchaseGroup = await PurchaseGroupManagerInstance.getSuggestionsPurchaseGroupByID(ID);
            purchaseGroup ? httpResponse.sendOk(res, purchaseGroup) : httpResponse.sendError(res);
        }
        catch (e) {
            httpResponse.sendError(res, e);
        }
    };

    getPurchaseGroupsByUserId = async (res, userId: string) => {
        try {
            const PurchaseGroupManagerInstance = PurchaseGroupManager.Instance;
            let purchaseGroups = await PurchaseGroupManagerInstance.getPurchaseGroupsByUserId(userId);
            purchaseGroups ? httpResponse.sendOk(res, purchaseGroups) : httpResponse.sendError(res);
        }
        catch (e) {
            httpResponse.sendError(res, e);
        }
    };

    getSalesPurchaseGroupsByUserId = async (res, userId: string) => {
        try {
            const PurchaseGroupManagerInstance = PurchaseGroupManager.Instance;
            let purchaseGroups = await PurchaseGroupManagerInstance.getSalesPurchaseGroupsByUserId(userId);
            purchaseGroups ? httpResponse.sendOk(res, purchaseGroups) : httpResponse.sendError(res);
        }
        catch (e) {
            httpResponse.sendError(res, e);
        }
    };


    buyPurchaseGroup = async (res, purchaseGroupID: string, amount: number, userID: string) => {
        try {
            amount = Number(amount);
            let purchaseGroupShouldClose: boolean = false;

            const PurchaseGroupManagerInstance = PurchaseGroupManager.Instance;
            let UserManagerInstance = UserManager.Instance;

            const purchaseGroup = await PurchaseGroupManagerInstance.getPurchaseGroupById(purchaseGroupID);
            const {credits} = await UserManagerInstance.getUser(userID);

            // purchase group validation tests
            if (purchaseGroup) {

                // check that group is active
                if (!purchaseGroup.isActive) {
                    const error: string = 'purchaseGroup is not available';
                    // httpResponse.sendError(res, error);
                    throw new Error(error)

                }

                //check available client's credits to purchase this group
                if (purchaseGroup.priceForGroup * amount > credits) {
                    const error: string = 'Not enough money to complete this action.';
                    // httpResponse.sendError(res, error);
                    throw new Error(error)
                }

                //check available amount for client to purchase
                if (purchaseGroup.totalAmount < amount) {
                    const error: string = 'Amount is not available for this purchase group';
                    // httpResponse.sendError(res, error);
                    throw new Error(error)
                }


                //check available amount left for client to purchase
                if (purchaseGroup.totalAmount < purchaseGroup.sales + amount) {
                    const error: string = 'cannot buy this amount';
                    // httpResponse.sendError(res, error);
                    throw new Error(error)
                }

                //check if purchase group should close after the udpate
                if (!amount) {
                    const error: string = 'Amount must be higher than 0';
                    // httpResponse.sendError(res, error);
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
                await Promise.all([
                    PurchaseGroupManagerInstance.addUserToPurchaseGroup(purchaseGroup.id, amount, userID),
                    UserManagerInstance.addPurchaseGroupToUser(purchaseGroup, amount, userID)
                ]);
            }
            // check and update purchase group active status if needed
            if (purchaseGroupShouldClose) {
                const updatedPurchaseGroup = await PurchaseGroupManagerInstance.updatePurchaseGroupById(purchaseGroup.id, {isActive: false})
                await UserManagerInstance.notifyClientsOnClosedPurchaseGroup(updatedPurchaseGroup);
            }
            httpResponse.sendOk(res);
        }
        catch (e) {
            httpResponse.sendError(res, e);
        }
    };

    getCustomPurchaseGroupsByUserId = async (res, userId: string) => {

        const TYPE_DEFAULT: string = 'cheapest';
        let type: string;
        const RETURN_ARRAY_AMOUNT: number = 4;
        const PurchaseGroupManagerInstance = PurchaseGroupManager.Instance;
        const customPurchaseGroupSelector = CustomPurchaseGroupSelector.Instance;


        //checking custom purchase group for current user by searching users's data
        try {
            type = await customPurchaseGroupSelector.selectCustomPurchaseGroupsTypeForUser(userId);
        } catch (e) {
            //if no relevant data - taking the cheapest
            type = TYPE_DEFAULT;
        }
        try {
            let purchaseGroups;
            type === TYPE_DEFAULT ?
                purchaseGroups = await PurchaseGroupManagerInstance.getSubPurchaseGroupsByType(null, "1", RETURN_ARRAY_AMOUNT) :
                purchaseGroups = await PurchaseGroupManagerInstance.getSubPurchaseGroupsByType(type, "1", RETURN_ARRAY_AMOUNT);

            const returnedResult = {
                purchaseGroups,
                type: type || TYPE_DEFAULT
            };

            purchaseGroups ? httpResponse.sendOk(res, returnedResult) : httpResponse.sendError(res);

        } catch (e) {
            httpResponse.sendError(res, e);
        }
    };

    removePurchaseGroupsFromUser = async (res, userID, purchaseGroupToRemove, amount, price) => {
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
    };

    removeSellPurchaseGroupsFromUser = async (res, userID, purchaseGroupToRemove) => {
        try {
            const PurchaseGroupManagerInstance = PurchaseGroupManager.Instance;
            await PurchaseGroupManagerInstance.removeSellPurchaseGroupsFromUser(userID, purchaseGroupToRemove)
            return await this.getPurchaseGroupsByUserId(res, userID);
        }
        catch (e) {
            httpResponse.sendError(res, e);
        }
    };

    purchaseGroupsViewed = async (res, userID, purchaseGroupsViewed) => {
        try {
            const PurchaseGroupManagerInstance = PurchaseGroupManager.Instance;
            await PurchaseGroupManagerInstance.purchaseGroupsViewed(userID, purchaseGroupsViewed);
            httpResponse.sendOk(res);
        }
        catch (e) {
            httpResponse.sendError(res, e);
        }
    };

    getSimilarGroupByName = async (res, purchaseGroupsSimilarName, userType) => {
        try {
            const PurchaseGroupManagerInstance = PurchaseGroupManager.Instance;
            const similarPurchaseGroup = await PurchaseGroupManagerInstance.getSimilarGroupByName(purchaseGroupsSimilarName, userType);
            httpResponse.sendOk(res, similarPurchaseGroup);
        }
        catch (e) {
            httpResponse.sendError(res, e);
        }
    };

    searchPurchaseGroup = async (res, searchValue) => {
        try {
            const PurchaseGroupManagerInstance = PurchaseGroupManager.Instance;
            let purchaseGroups = await PurchaseGroupManagerInstance.searchPurchaseGroup(searchValue);
            purchaseGroups ? httpResponse.sendOk(res, purchaseGroups) : httpResponse.sendError(res);
        }
        catch (e) {
            httpResponse.sendError(res, e);
        }
    };

    typeOnNotRelevantList = async (res, userID, type, status) => {
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
    };

    increaseAttemptsAndCheck = async (res, userID, type) => {
        try {
            const PurchaseGroupManagerInstance = PurchaseGroupManager.Instance;
            await PurchaseGroupManagerInstance.increaseAttemptsAndCheck(userID, type);
            httpResponse.sendOk(res)
        }
        catch (e) {
            httpResponse.sendError(res, e);
        }
    };

    createPurchaseGroup = async (res, data, userID) => {
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
    };

    takeSuggestionsPurchaseGroupOwnership = async (res, suggestionID, userID) => {
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
    };

    joinSuggestionGroup = async (res, groupID, userID) => {
        try {
            const PurchaseGroupManagerInstance = PurchaseGroupManager.Instance;
            PurchaseGroupManagerInstance.joinSuggestionGroup(groupID, userID);
            httpResponse.sendOk(res);
        }
        catch (e) {
            httpResponse.sendError(res, e);
        }
    };

    leaveSuggestionGroup = async (res, groupID, userID) => {
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
