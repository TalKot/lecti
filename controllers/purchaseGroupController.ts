import purchaseGroupManager from '../managers/purchaseGroupManager';

export default class purchaseGroupController {

    async getAllPurchaseGroups(res) {
        try {
            let purchaseGroupManagerInstance = new purchaseGroupManager();
            let purchaseGroups = await purchaseGroupManagerInstance.getAllPurchaseGroups();
            purchaseGroups ? this.sendOk(res, purchaseGroups) : this.sendError(res);
        }
        catch(e){
            this.sendError(res,e);
        }
    }

    private sendOk(res, data?: any) {
        res.status(200).json(data);
    }

    private sendError(res, error?, code?) {
        res.status(500).json({
            status: 500,
            statusText: "Internal Server Error",
            error: error ? error.toString() : "",
            code: code
        });
    }
}