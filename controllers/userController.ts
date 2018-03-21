import UserManager from '../managers/userManager';
import httpResponse from '../common/httpResponse'

export default class UserController {

    /****** will be user as singelton*****/
    private static _instance;

    public static get Instance() {
        return this._instance || (this._instance = new this());
    }
    /************************************/



    async getUserByID(res,userID) {
        try {
            let userManagerInstance = UserManager.Instance;

            let user = await userManagerInstance.getUser(userID);
            user ? httpResponse.sendOk(res, user) : httpResponse.sendError(res);
        }
        catch (e) {
            httpResponse.sendError(res, e);
        }
    }

    async getSellerById(res,userID) {
        try {
            let userManagerInstance = UserManager.Instance;
            let userSeller = await userManagerInstance.getUserSeller(userID);
            userSeller ? httpResponse.sendOk(res, userSeller) : httpResponse.sendError(res);
        }
        catch (e) {
            httpResponse.sendError(res, e);
        }
    }
}