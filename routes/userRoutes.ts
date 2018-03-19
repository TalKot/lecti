import userController from '../controllers/userController'
const requireLogin = require('../middlewares/requireLogin');

module.exports = app => {

    app.get('/api/seller/:id', async (req, res) => {
        const id = req.params.id;
        let userControllerInstance = new userController();
        await userControllerInstance.getSellerById(res,id);
    });

};
