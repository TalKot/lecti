import PurchaseGroupController from '../controllers/purchaseGroupController'

const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');

module.exports = app => {

    app.get('/api/purchaseGroup/getAll', async (req, res) => {
        const purchaseGroupControllerInstance = PurchaseGroupController.Instance;
        await purchaseGroupControllerInstance.getAllPurchaseGroups(res);
    });

    app.get('/api/purchaseGroup/getgroup/id/:id', async (req, res) => {
        const {id} = req.params;
        const purchaseGroupControllerInstance = PurchaseGroupController.Instance;
        await purchaseGroupControllerInstance.getPurchaseGroupById(res, id);
    });

    app.get('/api/purchaseGroup/getgroup/type/:type', async (req, res) => {
        const {type} = req.params;
        const {page} = req.query;
        const purchaseGroupControllerInstance = PurchaseGroupController.Instance;
        await purchaseGroupControllerInstance.getPurchaseGroupByType(res, type, page);
    });

    app.get('/api/purchaseGroup/getsuggestions/', async (req, res) => {
        let purchaseGroupControllerInstance = PurchaseGroupController.Instance;
        await purchaseGroupControllerInstance.getSuggestionsPurchaseGroups(res);
    });

    app.get('/api/purchaseGroup/getsuggestions/:ID', async (req, res) => {
        const {ID} = req.params;
        let purchaseGroupControllerInstance = PurchaseGroupController.Instance;
        await purchaseGroupControllerInstance.getSuggestionsPurchaseGroupByID(res, ID);
    });

    app.post('/api/purchaseGroup/getsuggestions/:ID', async (req, res) => {
        const suggestionID = req.params.ID;
        const userID = req.user.id;
        let purchaseGroupControllerInstance = PurchaseGroupController.Instance;
        await purchaseGroupControllerInstance.takeSuggestionsPurchaseGroupOwnership(res, suggestionID, userID);
    });

    app.post('/api/purchaseGroup/join/suggestions/', async (req, res) => {
        const {groupID} = req.body;
        const userID = req.user.id;
        let purchaseGroupControllerInstance = PurchaseGroupController.Instance;
        await purchaseGroupControllerInstance.joinSuggestionGroup(res, groupID, userID);
    });

    app.post('/api/purchaseGroup/leave/suggestions/', async (req, res) => {
        const {groupID} = req.body;
        const userID = req.user.id;
        let purchaseGroupControllerInstance = PurchaseGroupController.Instance;
        await purchaseGroupControllerInstance.leaveSuggestionGroup(res, groupID, userID);
    });

    app.get('/api/purchaseGroup/getgroup/user/', requireLogin, async (req, res) => {
        let purchaseGroupControllerInstance = PurchaseGroupController.Instance;
        await purchaseGroupControllerInstance.getPurchaseGroupsByUserId(res, req.user.id);
    });

    app.get('/api/purchaseGroup/getsales/user/', requireLogin, async (req, res) => {
        let purchaseGroupControllerInstance = PurchaseGroupController.Instance;
        await purchaseGroupControllerInstance.getSalesPurchaseGroupsByUserId(res, req.user.id);
    });

    app.post('/api/purchaseGroup/remove/:ID/', requireLogin, async (req, res) => {
        const {amount, price} = req.body;
        const purchaseGroupToRemove = req.params.ID;
        let purchaseGroupControllerInstance = PurchaseGroupController.Instance;
        await purchaseGroupControllerInstance.removePurchaseGroupsFromUser(res, req.user.id, purchaseGroupToRemove, amount, price);
    });

    app.post('/api/purchaseGroup/removesale/:ID/', requireLogin, async (req, res) => {
        const purchaseGroupToRemove = req.params.ID;
        let purchaseGroupControllerInstance = PurchaseGroupController.Instance;
        await purchaseGroupControllerInstance.removeSellPurchaseGroupsFromUser(res, req.user.id, purchaseGroupToRemove);
    });

    app.post('/api/purchaseGroup/viewed/:ID/', requireLogin, async (req, res) => {
        const purchaseGroupsViewed = req.params.ID;
        let purchaseGroupControllerInstance = PurchaseGroupController.Instance;
        await purchaseGroupControllerInstance.purchaseGroupsViewed(res, req.user.id, purchaseGroupsViewed);
    });

    app.get('/api/purchaseGroup/checksimilar/:isSeller/:name/', requireLogin, async (req, res) => {
        const purchaseGroupsSimilarName = req.params.name;
        const userType = req.params.isSeller;
        let purchaseGroupControllerInstance = PurchaseGroupController.Instance;
        console.log(purchaseGroupsSimilarName, userType);
        await purchaseGroupControllerInstance.getSimilarGroupByName(res, purchaseGroupsSimilarName, userType);
    });

    app.post('/api/purchaseGroup/buy/', requireLogin, requireCredits, async (req, res) => {
        let {purchaseGroupID, amount} = req.body;
        let userID = req.user._id.toString();
        let purchaseGroupControllerInstance = PurchaseGroupController.Instance;
        await purchaseGroupControllerInstance.buyPurchaseGroup(res, purchaseGroupID, amount, userID);
    });

    app.get('/api/purchaseGroup/search/:name/', async (req, res) => {
        const searchName = req.params.name;
        let purchaseGroupControllerInstance = PurchaseGroupController.Instance;
        await purchaseGroupControllerInstance.searchPurchaseGroup(res, searchName);
    });

    app.get('/api/purchaseGroup/getgroup/custom/', requireLogin, async (req, res) => {
        let purchaseGroupControllerInstance = PurchaseGroupController.Instance;
        await purchaseGroupControllerInstance.getCustomPurchaseGroupsByUserId(res, req.user.id);
    });

    app.post('/api/purchaseGroup/types/', requireLogin, async (req, res) => {
        let {type, status} = req.body;
        let purchaseGroupControllerInstance = PurchaseGroupController.Instance;
        await purchaseGroupControllerInstance.typeOnNotRelevantList(res, req.user.id, type, status);
    });

    app.post('/api/purchaseGroup/types/increase', requireLogin, async (req, res) => {
        let {type} = req.body;
        let purchaseGroupControllerInstance = PurchaseGroupController.Instance;
        await purchaseGroupControllerInstance.increaseAttemptsAndCheck(res, req.user.id, type);
    });

    app.post('/api/create/purchasegroup/', requireLogin, async (req, res) => {
        let data = req.body;
        let purchaseGroupControllerInstance = PurchaseGroupController.Instance;
        await purchaseGroupControllerInstance.createPurchaseGroup(res, data, req.user.id);
    });
};
