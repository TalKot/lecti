import purchaseGroupManager from '../managers/purchaseGroupManager';
import userManager from '../managers/userManager';
import httpResponse from '../common/httpResponse'
import CustomPurchaseGroupSelector from "../services/customPurchaseGropusSelector/customPurchaseGropusSelector";

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

    async buyPurchaseGroup(res, purchaseGroupID: string, amount: number, userID: string) {
        try {
            let purchaseGroupManagerInstance = new purchaseGroupManager();
            let userManagerInstance = new userManager();

            //check available amount for client to purchase
            const purchaseGroup = await purchaseGroupManagerInstance.getPurchaseGroupById(purchaseGroupID);
            if (purchaseGroup) {
                if (purchaseGroup.totalAmount < amount) {
                    const error: string = 'Amount is not available for this purchase group';
                    httpResponse.sendError(res, error);
                    throw new Error('Amount is not available for this purchase group')
                }
            }
            // update records values
            await Promise.all([
                purchaseGroupManagerInstance.addUserToPurchaseGroup(purchaseGroup.id, amount, userID),
                userManagerInstance.addPurchaseGroupToUser(purchaseGroup, amount, userID)
            ]);
            //return values
            let user = await userManagerInstance.getUser(userID);
            user ? httpResponse.sendOk(res, user) : httpResponse.sendError(res);
        }
        catch (e) {
            httpResponse.sendError(res, e);
        }
    }

    async getCustomPurchaseGroupsByUserId(res, userId: string) {
        try {
            const customPurchaseGroupSelector = new CustomPurchaseGroupSelector();
            const type = await customPurchaseGroupSelector.selectCustomPurchaseGroupsTypeForUser(userId);

            const purchaseGroupManagerInstance = new purchaseGroupManager();
            let purchaseGroups = await purchaseGroupManagerInstance.getPurchaseGroupsByType(type);

            purchaseGroups ? httpResponse.sendOk(res, purchaseGroups) : httpResponse.sendError(res);
        }
        catch (e) {
            httpResponse.sendError(res, e);
        }
    }
}