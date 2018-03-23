import * as mongoose from 'mongoose';
const User = mongoose.model('users');
const Comments = mongoose.model('comments');
const commentSchema = require('../models/Comment');

export default class CommentManager {
    /****** will be user as singelton*****/
    private static _instance;

    public static get Instance() {
        return this._instance || (this._instance = new this());
    }

    /************************************/

    async postComment(rating, seller, comment, userID){
        let commentObject = new commentSchema({rating,comment,seller,user:userID});
        commentObject = await commentObject.save();
        let user = await User.findById(userID);
        user.comments.push(commentObject);
        await user.save();
    }
}