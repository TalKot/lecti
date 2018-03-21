import * as mongoose from 'mongoose';
const User = mongoose.model('users');

export default class CartManager {
    /****** will be user as singelton*****/
    private static _instance;

    public static get Instance() {
        return this._instance || (this._instance = new this());
    }
    /************************************/


    async addToCart(purchaseGroupID: string, amount: number, userID: string) {
        await User.findByIdAndUpdate(userID, {
            $push: {
                cart: {
                    purchaseGroup: purchaseGroupID,
                    amount
                }
            }
        });
    }

    async removeFromCart(purchaseGroupID, userID) {

        await User.findByIdAndUpdate(userID, {
            $pull: {
                cart: {
                    purchaseGroup: purchaseGroupID
                }
            }
        });
        return await User.findByIdAndUpdate(userID);
    }
}