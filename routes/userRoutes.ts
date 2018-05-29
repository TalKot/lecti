import UserController from '../controllers/userController'

const requireLogin = require('../middlewares/requireLogin');

module.exports = app => {

    app.get('/api/seller/:id', async (req, res) => {
        const id = req.params.id;
        let userControllerInstance = UserController.Instance;
        await userControllerInstance.getSellerById(res, id);
    });

    app.post('/api/newseller',requireLogin, async (req, res) => {
        const {id} = req.user;
        let {body} = req;
        let userControllerInstance = UserController.Instance;
        await userControllerInstance.alertAdminsNewSellerRequest(res, id, body);
    });

};
