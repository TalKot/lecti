import CommentManager from '../managers/commentManager';
import httpResponse from '../common/httpResponse'

export default class CommentController {

    /****** will be user as singelton*****/
    private static _instance;

    public static get Instance() {
        return this._instance || (this._instance = new this());
    }
    /************************************/

    async postComment(res, rating, seller, comment, userID){
        try {
            await CommentManager.Instance.postComment(rating, seller, comment, userID);
            httpResponse.sendOk(res);
        }
        catch (e) {
            httpResponse.sendError(res, e);
        }
    }
}