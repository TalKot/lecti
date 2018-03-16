import purchaseGroupManager from '../managers/purchaseGroupManager';
import userManager from '../managers/userManager';
import httpResponse from '../common/httpResponse'
import CustomPurchaseGroupSelector from "../services/customPurchaseGropusSelector/customPurchaseGropusSelector";
import * as _ from 'lodash';

export default class purchaseGroupController {

    async getAllPurchaseGroups(res) {
        try {
            let purchaseGroupManagerInstance = new purchaseGroupManager();
            let purchaseGroups = await purchaseGroupManagerInstance.getAllPurchaseGroups();
            purchaseGroups ? httpResponse.sendOk(res, purchaseGroups) : httpResponse.sendError(res);
        }
        catch (e) {
            httpResponse.sendError(res, e);
        }
    }

    async getPurchaseGroupById(res, id: string) {
        try {
            let purchaseGroupManagerInstance = new purchaseGroupManager();
            let purchaseGroups = await purchaseGroupManagerInstance.getPurchaseGroupById(id);
            purchaseGroups ? httpResponse.sendOk(res, purchaseGroups) : httpResponse.sendError(res);
        }
        catch (e) {
            httpResponse.sendError(res, e);
        }
    }

    async getPurchaseGroupByType(res, type: string) {
        try {
            let purchaseGroupManagerInstance = new purchaseGroupManager();
            let purchaseGroups = await purchaseGroupManagerInstance.getPurchaseGroupsByType(type);
            purchaseGroups ? httpResponse.sendOk(res, purchaseGroups) : httpResponse.sendError(res);
        }
        catch (e) {
            httpResponse.sendError(res, e);
        }
    }

    async getSuggestionsPurchaseGroupByType(res) {
        try {
            let purchaseGroupManagerInstance = new purchaseGroupManager();
            let purchaseGroups = await purchaseGroupManagerInstance.getSuggestionsPurchaseGroupByType();
            purchaseGroups ? httpResponse.sendOk(res, purchaseGroups) : httpResponse.sendError(res);
        }
        catch (e) {
            httpResponse.sendError(res, e);
        }
    }

    async getPurchaseGroupsByUserId(res, userId: string) {
        try {
            let purchaseGroupManagerInstance = new purchaseGroupManager();
            let purchaseGroups = await purchaseGroupManagerInstance.getPurchaseGroupsByUserId(userId);
            purchaseGroups ? httpResponse.sendOk(res, purchaseGroups) : httpResponse.sendError(res);
        }
        catch (e) {
            httpResponse.sendError(res, e);
        }
    }

    async getSalesPurchaseGroupsByUserId(res, userId: string) {
        try {
            let purchaseGroupManagerInstance = new purchaseGroupManager();
            let purchaseGroups = await purchaseGroupManagerInstance.getSalesPurchaseGroupsByUserId(userId);
            purchaseGroups ? httpResponse.sendOk(res, purchaseGroups) : httpResponse.sendError(res);
        }
        catch (e) {
            httpResponse.sendError(res, e);
        }
    }

    async buyPurchaseGroup(res, purchaseGroupID: string, amount: number, userID: string) {
        try {
            amount = Number(amount);
            let purchaseGroupShouldClose : boolean = false;

            let purchaseGroupManagerInstance = new purchaseGroupManager();
            let userManagerInstance = new userManager();

            const purchaseGroup = await purchaseGroupManagerInstance.getPurchaseGroupById(purchaseGroupID);

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
            const purchaseGroupsBought = await userManagerInstance.getPurchaseGroupsBoughtByUserID(userID);
            let userPurchaseGroupBoughtList = _.keyBy(purchaseGroupsBought, obj =>
                obj.purchaseGroup.toString()
            );

            if (userPurchaseGroupBoughtList[purchaseGroupID]) {
                //purchase group already in this user list
                // in user - need to update user credits and purchaseGroupsBought amount
                // in purchase group - need to update sales and potentialBuyers
                await Promise.all([
                    userManagerInstance.updatePurchaseGroupToUser(purchaseGroupID, purchaseGroup.priceForGroup, amount, userID),
                    purchaseGroupManagerInstance.updateUserOnPurchaseGroup(purchaseGroupID, purchaseGroup.priceForGroup, amount, userID)
                ])

            } else {
                //new purchase group for this user
                // update records values
                // await Promise.all([
                    await purchaseGroupManagerInstance.addUserToPurchaseGroup(purchaseGroup.id, amount, userID),
                    await userManagerInstance.addPurchaseGroupToUser(purchaseGroup, amount, userID)
                // ]);
            }
            // check and update purchase group active status if needed
            if(purchaseGroupShouldClose){
                await purchaseGroupManagerInstance.updatePurchaseGroupById(purchaseGroup.id,{isActive:false})
            }
            //return values
            await this.getPurchaseGroupByType(res, purchaseGroup.type);

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

            const purchaseGroupManagerInstance = new purchaseGroupManager();
            let purchaseGroups = await purchaseGroupManagerInstance.getPurchaseGroupsByType(type,RETURN_ARRAY_AMOUNT);

            purchaseGroups ? httpResponse.sendOk(res, purchaseGroups) : httpResponse.sendError(res);
        }
        catch (e) {
            httpResponse.sendError(res, e);
        }
    }

    async removePurchaseGroupsFromUser(res, userID, purchaseGroupToRemove, amount, price) {
        try {
            let purchaseGroupManagerInstance = new purchaseGroupManager();
            let userManagerInstance = new userManager();

            // in user - update credits & purchaseGroupsBought
            // in purchase group - sales & potentialBuyers
            await Promise.all([
                purchaseGroupManagerInstance.removeUserFromPurchaseGroup(userID, purchaseGroupToRemove, amount),
                userManagerInstance.removePurchaseGroupFromUser(userID, purchaseGroupToRemove, amount, price)
            ])
            return await this.getPurchaseGroupsByUserId(res, userID);
        }
        catch (e) {
            httpResponse.sendError(res, e);
        }
    }

    async removeSellPurchaseGroupsFromUser(res, userID, purchaseGroupToRemove) {
        try {
            let purchaseGroupManagerInstance = new purchaseGroupManager();
            await purchaseGroupManagerInstance.removeSellPurchaseGroupsFromUser(userID, purchaseGroupToRemove)

            //TODO - THIS SHOULD BE RETURNED?
            return await this.getPurchaseGroupsByUserId(res, userID);
        }
        catch (e) {
            httpResponse.sendError(res, e);
        }
    }

    async purchaseGroupsViewed(res, userID,purchaseGroupsViewed){
        try {
            let purchaseGroupManagerInstance = new purchaseGroupManager();
            await purchaseGroupManagerInstance.purchaseGroupsViewed(userID, purchaseGroupsViewed);
            return;
        }
        catch (e) {
            httpResponse.sendError(res, e);
        }
    }

    async searchPurchaseGroup(res, searchValue){
        try {
            let purchaseGroupManagerInstance = new purchaseGroupManager();
            let purchaseGroups = await purchaseGroupManagerInstance.searchPurchaseGroup(searchValue);
            purchaseGroups ? httpResponse.sendOk(res, purchaseGroups) : httpResponse.sendError(res);
        }
        catch (e) {
            httpResponse.sendError(res, e);
        }
    }

    async typeOnNotRelevantList(res, userID, type, status){
        try {
            let purchaseGroupManagerInstance = new purchaseGroupManager();

            if(status){
                //add purchase group type to not relevant list
                await purchaseGroupManagerInstance.addTypeToNotRelevantList(userID, type);
            }else{
                //remove purchase group type to not relevant list
                await purchaseGroupManagerInstance.removeTypeToNotRelevantList(userID, type);
            }
        }
        catch (e) {
            httpResponse.sendError(res, e);
        }
    }

    async increaseAttemptsAndCheck(res, userID,type){
        try {
            let purchaseGroupManagerInstance = new purchaseGroupManager();
            await purchaseGroupManagerInstance.increaseAttemptsAndCheck(userID,type);
            httpResponse.sendOk(res)
        }
        catch (e) {
            httpResponse.sendError(res, e);
        }
    }

    async createPurchaseGroup(res, data,userID){
        try {
            let purchaseGroupManagerInstance = new purchaseGroupManager();
            let userManagerInstance = new userManager();
            const user = await userManagerInstance.getUser(userID);
            user.isSeller ? data.seller = userID : data.isSuggestion = true;
            let purchaseGroup = await purchaseGroupManagerInstance.createPurchaseGroup(data);
            user.purchaseGroupsSell.push(purchaseGroup._id);
            await user.save();
            purchaseGroup ? httpResponse.sendOk(res, purchaseGroup) : httpResponse.sendError(res);
        }
        catch (e) {
            httpResponse.sendError(res, e);
        }
    }
}