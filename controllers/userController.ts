import userManager from '../managers/userManager';
import httpResponse from '../common/httpResponse'

export default class userController {

    async getUserByID(res,userID) {
        try {
            let userManagerInstance = new userManager();
            let user = await userManagerInstance.getUser(userID);
            user ? httpResponse.sendOk(res, user) : httpResponse.sendError(res);
        }
        catch (e) {
            httpResponse.sendError(res, e);
        }
    }

    async getSellerById(res,userID) {
        try {
            let userManagerInstance = new userManager();
            let userSeller = await userManagerInstance.getUserSeller(userID);
            userSeller ? httpResponse.sendOk(res, userSeller) : httpResponse.sendError(res);
        }
        catch (e) {
            httpResponse.sendError(res, e);
        }
    }
}