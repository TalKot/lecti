import purchaseGroupManager from "../managers/purchaseGroupManager";
import userManager from '../managers/userManager';
// import cartManager from '../managers/cartManager';

import httpResponse from '../common/httpResponse'

export default class cartController {

    async addToCart(res, purchaseGroupID: string, amount: number, userID: string) {
        try {
            let purchaseGroupManagerInstance = new purchaseGroupManager();
            let userManagerInstance = new userManager();


            //check available amount for client to purchase
            const purchaseGroup = await purchaseGroupManagerInstance.getPurchaseGroupById(purchaseGroupID)
            if (purchaseGroup) {
                if (purchaseGroup.totalAmount < amount) {
                    const error: string = 'Amount is not available for this purchase group';
                    httpResponse.sendError(res, error);
                }
            }

            // update records values
            purchaseGroupManagerInstance.addToCart(purchaseGroupID, amount, userID);

            //return updated user data
            let user = await userManagerInstance.getUser(userID);
            user ? httpResponse.sendOk(res, user) : httpResponse.sendError(res);
        }
        catch (e) {
            httpResponse.sendError(res, e);
        }
    }

    async removeFromCart(res, purchaseGroupID, userID) {
        try {
            let userManagerInstance = new userManager();
            // update records values & return updated user data
            const user = await userManagerInstance.removeFromCart(purchaseGroupID, userID);
            user ? httpResponse.sendOk(res, user) : httpResponse.sendError(res);
        }
        catch (e) {
            httpResponse.sendError(res, e);
        }
    }
}