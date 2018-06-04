import UserManager from '../managers/userManager';
import httpResponse from '../common/httpResponse'

export default class UserController {

    /****** will be user as singelton*****/
    private static _instance;

    public static get Instance() {
        return this._instance || (this._instance = new this());
    }

    /************************************/


    getUserByID = async (res, userID) => {
        try {
            let userManagerInstance = UserManager.Instance;

            let user = await userManagerInstance.getUser(userID);
            user ? httpResponse.sendOk(res, user) : httpResponse.sendError(res);
        }
        catch (e) {
            httpResponse.sendError(res, e);
        }
    };

    getSellerById = async (res, userID) => {
        try {
            let userManagerInstance = UserManager.Instance;
            let userSeller = await userManagerInstance.getUserSeller(userID);
            userSeller ? httpResponse.sendOk(res, userSeller) : httpResponse.sendError(res);
        }
        catch (e) {
            httpResponse.sendError(res, e);
        }
    };

    alertAdminsNewSellerRequest = async (res, userID, body) => {
        try {
            let userManagerInstance = UserManager.Instance;
            await userManagerInstance.alertAdminsNewSellerRequest(userID, body);
            httpResponse.sendOk(res);
        }
        catch (e) {
            httpResponse.sendError(res, e);
        }
    };
}