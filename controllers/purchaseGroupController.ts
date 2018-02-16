import purchaseGroupManager from '../managers/purchaseGroupManager';
import httpResponse from '../common/httpResponse'

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

    async getPurchaseGroupById(res, id) {
        try {
            let purchaseGroupManagerInstance = new purchaseGroupManager();
            let purchaseGroups = await purchaseGroupManagerInstance.getPurchaseGroupById(id);
            purchaseGroups ? httpResponse.sendOk(res, purchaseGroups) : httpResponse.sendError(res);
        }
        catch (e) {
            httpResponse.sendError(res, e);
        }
    }

    async getPurchaseGroupByType(res, type) {
        try {
            let purchaseGroupManagerInstance = new purchaseGroupManager();
            let purchaseGroups = await purchaseGroupManagerInstance.getPurchaseGroupsByType(type);
            purchaseGroups ? httpResponse.sendOk(res, purchaseGroups) : httpResponse.sendError(res);
        }
        catch (e) {
            httpResponse.sendError(res, e);
        }
    }

    async getPurchaseGroupsByUserId(res, userId) {
        try {
            let purchaseGroupManagerInstance = new purchaseGroupManager();
            let purchaseGroups = await purchaseGroupManagerInstance.getPurchaseGroupsByUserId(userId);
            purchaseGroups ? httpResponse.sendOk(res, purchaseGroups) : httpResponse.sendError(res);
        }
        catch (e) {
            httpResponse.sendError(res, e);
        }
    }
}