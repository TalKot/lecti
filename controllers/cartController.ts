import PurchaseGroupManager from "../managers/purchaseGroupManager";
import UserManager from '../managers/userManager';
import CartManager from '../managers/cartManager';

import httpResponse from '../common/httpResponse'

export default class CartController {
    /****** will be user as singelton*****/
    private static _instance;

    public static get Instance() {
        return this._instance || (this._instance = new this());
    }
    /************************************/

    async addToCart(res, purchaseGroupID: string, amount: number, userID: string) {
        try {
            const purchaseGroupManagerInstance = PurchaseGroupManager.Instance;
            const cartManagerInstance = CartManager.Instance;
            const userManagerInstance = UserManager.Instance;


            //check available amount for client to purchase
            const purchaseGroup = await purchaseGroupManagerInstance.getPurchaseGroupById(purchaseGroupID)
            if (purchaseGroup) {
                if (purchaseGroup.totalAmount < amount) {
                    const error: string = 'Amount is not available for this purchase group';
                    httpResponse.sendError(res, error);
                }
            }

            // update records values
            await cartManagerInstance.addToCart(purchaseGroupID, amount, userID);

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
            const cartManagerInstance = CartManager.Instance;
            // update records values & return updated user data
            const user = await cartManagerInstance.removeFromCart(purchaseGroupID, userID);
            user ? httpResponse.sendOk(res, user) : httpResponse.sendError(res);
        }
        catch (e) {
            httpResponse.sendError(res, e);
        }
    }
}