import * as mongoose from 'mongoose';
const User = mongoose.model('users');

export default class userManager {

    async getUser(userID) {
        const user = await User.findById(userID);
        return user ? user : null;
    }
}