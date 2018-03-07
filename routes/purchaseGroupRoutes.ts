import purchaseGroupController from '../controllers/purchaseGroupController'

const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
module.exports = app => {

    app.get('/api/purchaseGroup/getAll', async (req, res) => {
        let purchaseGroupControllerInstance = new purchaseGroupController();
        await purchaseGroupControllerInstance.getAllPurchaseGroups(res);
    });

    app.get('/api/purchaseGroup/getgroup/id/:id', async (req, res) => {
        const id = req.params.id;
        let purchaseGroupControllerInstance = new purchaseGroupController();
        await purchaseGroupControllerInstance.getPurchaseGroupById(res, id);
    });

    app.get('/api/purchaseGroup/getgroup/type/:type', async (req, res) => {
        const type = req.params.type;
        let purchaseGroupControllerInstance = new purchaseGroupController();
        await purchaseGroupControllerInstance.getPurchaseGroupByType(res, type);
    });

    app.get('/api/purchaseGroup/getgroup/user/', requireLogin, async (req, res) => {
        let purchaseGroupControllerInstance = new purchaseGroupController();
        await purchaseGroupControllerInstance.getPurchaseGroupsByUserId(res, req.user.id);
    });

    app.get('/api/purchaseGroup/getsales/user/', requireLogin, async (req, res) => {
        let purchaseGroupControllerInstance = new purchaseGroupController();
        await purchaseGroupControllerInstance.getSalesPurchaseGroupsByUserId(res, req.user.id);
    });

    app.post('/api/purchaseGroup/remove/:ID/', requireLogin, async (req, res) => {
        const {amount,price} = req.body;
        const purchaseGroupToRemove = req.params.ID;
        let purchaseGroupControllerInstance = new purchaseGroupController();
        await purchaseGroupControllerInstance.removePurchaseGroupsFromUser(res, req.user.id,purchaseGroupToRemove,amount,price);
    });

    app.post('/api/purchaseGroup/removesale/:ID/', requireLogin, async (req, res) => {
        const purchaseGroupToRemove = req.params.ID;
        let purchaseGroupControllerInstance = new purchaseGroupController();
        await purchaseGroupControllerInstance.removeSellPurchaseGroupsFromUser(res, req.user.id,purchaseGroupToRemove);
    });

    app.post('/api/purchaseGroup/viewed/:ID/', requireLogin, async (req, res) => {
        const purchaseGroupsViewed = req.params.ID;
        let purchaseGroupControllerInstance = new purchaseGroupController();
        await purchaseGroupControllerInstance.purchaseGroupsViewed(res, req.user.id,purchaseGroupsViewed);
    });

    app.post('/api/purchaseGroup/buy/', requireLogin, requireCredits, async (req, res) => {
        let {purchaseGroupID, amount} = req.body;
        let userID = req.user._id.toString();
        let purchaseGroupControllerInstance = new purchaseGroupController();
        await purchaseGroupControllerInstance.buyPurchaseGroup(res, purchaseGroupID, amount, userID);
    });

    app.get('/api/purchaseGroup/search/:name/', async (req, res) => {
        const searchName = req.params.name;
        let purchaseGroupControllerInstance = new purchaseGroupController();
        await purchaseGroupControllerInstance.searchPurchaseGroup(res, searchName);
    });

    app.get('/api/purchaseGroup/getgroup/custom/', requireLogin, async (req, res) => {
        let purchaseGroupControllerInstance = new purchaseGroupController();
        await purchaseGroupControllerInstance.getCustomPurchaseGroupsByUserId(res, req.user.id);
    });
};
