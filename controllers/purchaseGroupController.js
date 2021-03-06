"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const purchaseGroupManager_1 = require("../managers/purchaseGroupManager");
const userManager_1 = require("../managers/userManager");
const httpResponse_1 = require("../common/httpResponse");
const customPurchaseGropusSelector_1 = require("../services/customPurchaseGropusSelector/customPurchaseGropusSelector");
const _ = require("lodash");
class PurchaseGroupController {
    constructor() {
        /************************************/
        this.getAllPurchaseGroups = (res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const PurchaseGroupManagerInstance = purchaseGroupManager_1.default.Instance;
                let purchaseGroups = yield PurchaseGroupManagerInstance.getAllPurchaseGroups();
                purchaseGroups ? httpResponse_1.default.sendOk(res, purchaseGroups) : httpResponse_1.default.sendError(res);
            }
            catch (e) {
                httpResponse_1.default.sendError(res, e);
            }
        });
        this.getPurchaseGroupById = (res, id) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const PurchaseGroupManagerInstance = purchaseGroupManager_1.default.Instance;
                let purchaseGroups = yield PurchaseGroupManagerInstance.getPurchaseGroupById(id);
                purchaseGroups ? httpResponse_1.default.sendOk(res, purchaseGroups) : httpResponse_1.default.sendError(res);
            }
            catch (e) {
                httpResponse_1.default.sendError(res, e);
            }
        });
        this.getPurchaseGroupByType = (res, type, page) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const PurchaseGroupManagerInstance = purchaseGroupManager_1.default.Instance;
                let purchaseGroups = yield PurchaseGroupManagerInstance.getPurchaseGroupsByType(type, page);
                purchaseGroups ? httpResponse_1.default.sendOk(res, purchaseGroups) : httpResponse_1.default.sendError(res);
            }
            catch (e) {
                httpResponse_1.default.sendError(res, e);
            }
        });
        this.getSuggestionsPurchaseGroups = (res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const PurchaseGroupManagerInstance = purchaseGroupManager_1.default.Instance;
                let purchaseGroups = yield PurchaseGroupManagerInstance.getSuggestionsPurchaseGroups();
                purchaseGroups ? httpResponse_1.default.sendOk(res, purchaseGroups) : httpResponse_1.default.sendError(res);
            }
            catch (e) {
                httpResponse_1.default.sendError(res, e);
            }
        });
        this.getSuggestionsPurchaseGroupByID = (res, ID) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const PurchaseGroupManagerInstance = purchaseGroupManager_1.default.Instance;
                let purchaseGroup = yield PurchaseGroupManagerInstance.getSuggestionsPurchaseGroupByID(ID);
                purchaseGroup ? httpResponse_1.default.sendOk(res, purchaseGroup) : httpResponse_1.default.sendError(res);
            }
            catch (e) {
                httpResponse_1.default.sendError(res, e);
            }
        });
        this.getPurchaseGroupsByUserId = (res, userId) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const PurchaseGroupManagerInstance = purchaseGroupManager_1.default.Instance;
                let purchaseGroups = yield PurchaseGroupManagerInstance.getPurchaseGroupsByUserId(userId);
                purchaseGroups ? httpResponse_1.default.sendOk(res, purchaseGroups) : httpResponse_1.default.sendError(res);
            }
            catch (e) {
                httpResponse_1.default.sendError(res, e);
            }
        });
        this.getSalesPurchaseGroupsByUserId = (res, userId) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const PurchaseGroupManagerInstance = purchaseGroupManager_1.default.Instance;
                let purchaseGroups = yield PurchaseGroupManagerInstance.getSalesPurchaseGroupsByUserId(userId);
                purchaseGroups ? httpResponse_1.default.sendOk(res, purchaseGroups) : httpResponse_1.default.sendError(res);
            }
            catch (e) {
                httpResponse_1.default.sendError(res, e);
            }
        });
        this.buyPurchaseGroup = (res, purchaseGroupID, amount, userID) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                amount = Number(amount);
                let purchaseGroupShouldClose = false;
                const PurchaseGroupManagerInstance = purchaseGroupManager_1.default.Instance;
                let UserManagerInstance = userManager_1.default.Instance;
                const purchaseGroup = yield PurchaseGroupManagerInstance.getPurchaseGroupById(purchaseGroupID);
                const { credits } = yield UserManagerInstance.getUser(userID);
                // purchase group validation tests
                if (purchaseGroup) {
                    // check that group is active
                    if (!purchaseGroup.isActive) {
                        const error = 'purchaseGroup is not available';
                        // httpResponse.sendError(res, error);
                        throw new Error(error);
                    }
                    //check available client's credits to purchase this group
                    if (purchaseGroup.priceForGroup * amount > credits) {
                        const error = 'Not enough money to complete this action.';
                        // httpResponse.sendError(res, error);
                        throw new Error(error);
                    }
                    //check available amount for client to purchase
                    if (purchaseGroup.totalAmount < amount) {
                        const error = 'Amount is not available for this purchase group';
                        // httpResponse.sendError(res, error);
                        throw new Error(error);
                    }
                    //check available amount left for client to purchase
                    if (purchaseGroup.totalAmount < purchaseGroup.sales + amount) {
                        const error = 'cannot buy this amount';
                        // httpResponse.sendError(res, error);
                        throw new Error(error);
                    }
                    //check if purchase group should close after the udpate
                    if (!amount) {
                        const error = 'Amount must be higher than 0';
                        // httpResponse.sendError(res, error);
                        throw new Error(error);
                    }
                    //check if purchase group should close after the udpate
                    if (purchaseGroup.totalAmount === purchaseGroup.sales + amount) {
                        purchaseGroupShouldClose = true;
                    }
                }
                //validate that purchase group is new
                const purchaseGroupsBought = yield UserManagerInstance.getPurchaseGroupsBoughtByUserID(userID);
                let userPurchaseGroupBoughtList = _.keyBy(purchaseGroupsBought, obj => obj.purchaseGroup.toString());
                if (userPurchaseGroupBoughtList[purchaseGroupID]) {
                    //purchase group already in this user list
                    // in user - need to update user credits and purchaseGroupsBought amount
                    // in purchase group - need to update sales and potentialBuyers
                    yield Promise.all([
                        UserManagerInstance.updatePurchaseGroupToUser(purchaseGroupID, purchaseGroup.priceForGroup, amount, userID),
                        PurchaseGroupManagerInstance.updateUserOnPurchaseGroup(purchaseGroupID, purchaseGroup.priceForGroup, amount, userID)
                    ]);
                }
                else {
                    //new purchase group for this user
                    // update records values
                    yield Promise.all([
                        PurchaseGroupManagerInstance.addUserToPurchaseGroup(purchaseGroup.id, amount, userID),
                        UserManagerInstance.addPurchaseGroupToUser(purchaseGroup, amount, userID)
                    ]);
                }
                // check and update purchase group active status if needed
                if (purchaseGroupShouldClose) {
                    const updatedPurchaseGroup = yield PurchaseGroupManagerInstance.updatePurchaseGroupById(purchaseGroup.id, { isActive: false });
                    yield UserManagerInstance.notifyClientsOnClosedPurchaseGroup(updatedPurchaseGroup);
                }
                httpResponse_1.default.sendOk(res);
            }
            catch (e) {
                httpResponse_1.default.sendError(res, e);
            }
        });
        this.getCustomPurchaseGroupsByUserId = (res, userId) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const TYPE_DEFAULT = 'cheapest';
            let type;
            const RETURN_ARRAY_AMOUNT = 4;
            const PurchaseGroupManagerInstance = purchaseGroupManager_1.default.Instance;
            const customPurchaseGroupSelector = customPurchaseGropusSelector_1.default.Instance;
            //checking custom purchase group for current user by searching users's data
            try {
                type = yield customPurchaseGroupSelector.selectCustomPurchaseGroupsTypeForUser(userId);
            }
            catch (e) {
                //if no relevant data - taking the cheapest
                type = TYPE_DEFAULT;
            }
            try {
                let purchaseGroups;
                type === TYPE_DEFAULT ?
                    purchaseGroups = yield PurchaseGroupManagerInstance.getSubPurchaseGroupsByType(null, "1", RETURN_ARRAY_AMOUNT) :
                    purchaseGroups = yield PurchaseGroupManagerInstance.getSubPurchaseGroupsByType(type, "1", RETURN_ARRAY_AMOUNT);
                const returnedResult = {
                    purchaseGroups,
                    type: type || TYPE_DEFAULT
                };
                purchaseGroups ? httpResponse_1.default.sendOk(res, returnedResult) : httpResponse_1.default.sendError(res);
            }
            catch (e) {
                httpResponse_1.default.sendError(res, e);
            }
        });
        this.removePurchaseGroupsFromUser = (res, userID, purchaseGroupToRemove, amount, price) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const PurchaseGroupManagerInstance = purchaseGroupManager_1.default.Instance;
                let UserManagerInstance = userManager_1.default.Instance;
                // in user - update credits & purchaseGroupsBought
                // in purchase group - sales & potentialBuyers
                yield Promise.all([
                    PurchaseGroupManagerInstance.removeUserFromPurchaseGroup(userID, purchaseGroupToRemove, amount),
                    UserManagerInstance.removePurchaseGroupFromUser(userID, purchaseGroupToRemove, amount, price)
                ]);
                return yield this.getPurchaseGroupsByUserId(res, userID);
            }
            catch (e) {
                httpResponse_1.default.sendError(res, e);
            }
        });
        this.removeSellPurchaseGroupsFromUser = (res, userID, purchaseGroupToRemove) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const PurchaseGroupManagerInstance = purchaseGroupManager_1.default.Instance;
                yield PurchaseGroupManagerInstance.removeSellPurchaseGroupsFromUser(userID, purchaseGroupToRemove);
                return yield this.getPurchaseGroupsByUserId(res, userID);
            }
            catch (e) {
                httpResponse_1.default.sendError(res, e);
            }
        });
        this.purchaseGroupsViewed = (res, userID, purchaseGroupsViewed) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const PurchaseGroupManagerInstance = purchaseGroupManager_1.default.Instance;
                yield PurchaseGroupManagerInstance.purchaseGroupsViewed(userID, purchaseGroupsViewed);
                httpResponse_1.default.sendOk(res);
            }
            catch (e) {
                httpResponse_1.default.sendError(res, e);
            }
        });
        this.getSimilarGroupByName = (res, purchaseGroupsSimilarName, userType) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const PurchaseGroupManagerInstance = purchaseGroupManager_1.default.Instance;
                const similarPurchaseGroup = yield PurchaseGroupManagerInstance.getSimilarGroupByName(purchaseGroupsSimilarName, userType);
                httpResponse_1.default.sendOk(res, similarPurchaseGroup);
            }
            catch (e) {
                httpResponse_1.default.sendError(res, e);
            }
        });
        this.searchPurchaseGroup = (res, searchValue) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const PurchaseGroupManagerInstance = purchaseGroupManager_1.default.Instance;
                let purchaseGroups = yield PurchaseGroupManagerInstance.searchPurchaseGroup(searchValue);
                purchaseGroups ? httpResponse_1.default.sendOk(res, purchaseGroups) : httpResponse_1.default.sendError(res);
            }
            catch (e) {
                httpResponse_1.default.sendError(res, e);
            }
        });
        this.typeOnNotRelevantList = (res, userID, type, status) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const PurchaseGroupManagerInstance = purchaseGroupManager_1.default.Instance;
                if (status) {
                    //add purchase group type to not relevant list
                    yield PurchaseGroupManagerInstance.addTypeToNotRelevantList(userID, type);
                }
                else {
                    //remove purchase group type to not relevant list
                    yield PurchaseGroupManagerInstance.removeTypeToNotRelevantList(userID, type);
                }
            }
            catch (e) {
                httpResponse_1.default.sendError(res, e);
            }
        });
        this.increaseAttemptsAndCheck = (res, userID, type) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const PurchaseGroupManagerInstance = purchaseGroupManager_1.default.Instance;
                yield PurchaseGroupManagerInstance.increaseAttemptsAndCheck(userID, type);
                httpResponse_1.default.sendOk(res);
            }
            catch (e) {
                httpResponse_1.default.sendError(res, e);
            }
        });
        this.createPurchaseGroup = (res, data, userID) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const PurchaseGroupManagerInstance = purchaseGroupManager_1.default.Instance;
                let UserManagerInstance = userManager_1.default.Instance;
                const user = yield UserManagerInstance.getUser(userID);
                let purchaseGroup = {};
                if (user.isSeller) {
                    //will create active purchase group because user type seller
                    data.seller = userID;
                    purchaseGroup = yield PurchaseGroupManagerInstance.createPurchaseGroup(data);
                    user.purchaseGroupsSell.push(purchaseGroup['_id']);
                    yield user.save();
                }
                else {
                    //will create suggestion purchase group because user ype is buyer
                    data.isSuggestion = true;
                    purchaseGroup = yield PurchaseGroupManagerInstance.createSuggestionsPurchaseGroup(data);
                }
                purchaseGroup ? httpResponse_1.default.sendOk(res, purchaseGroup) : httpResponse_1.default.sendError(res);
            }
            catch (e) {
                httpResponse_1.default.sendError(res, e);
            }
        });
        this.takeSuggestionsPurchaseGroupOwnership = (res, suggestionID, userID) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                let UserManagerInstance = userManager_1.default.Instance;
                const PurchaseGroupManagerInstance = purchaseGroupManager_1.default.Instance;
                yield Promise.all([
                    UserManagerInstance.takeSuggestionsPurchaseGroupOwnership(suggestionID, userID),
                    PurchaseGroupManagerInstance.takeSuggestionsPurchaseGroupOwnership(suggestionID, userID)
                ]);
                httpResponse_1.default.sendOk(res);
            }
            catch (e) {
                httpResponse_1.default.sendError(res, e);
            }
        });
        this.joinSuggestionGroup = (res, groupID, userID) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const PurchaseGroupManagerInstance = purchaseGroupManager_1.default.Instance;
                PurchaseGroupManagerInstance.joinSuggestionGroup(groupID, userID);
                httpResponse_1.default.sendOk(res);
            }
            catch (e) {
                httpResponse_1.default.sendError(res, e);
            }
        });
        this.leaveSuggestionGroup = (res, groupID, userID) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const PurchaseGroupManagerInstance = purchaseGroupManager_1.default.Instance;
                PurchaseGroupManagerInstance.leaveSuggestionGroup(groupID, userID);
                httpResponse_1.default.sendOk(res);
            }
            catch (e) {
                httpResponse_1.default.sendError(res, e);
            }
        });
    }
    static get Instance() {
        return this._instance || (this._instance = new this());
    }
}
exports.default = PurchaseGroupController;
//# sourceMappingURL=purchaseGroupController.js.map