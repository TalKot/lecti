import UserController from '../controllers/userController'
import CommentController from '../controllers/commentController'

const requireLogin = require('../middlewares/requireLogin');

module.exports = app => {

    app.post('/api/comment/add', requireLogin, async (req, res) => {
        let {rating, seller, comment} = req.body;
        let commentControllerInstance = CommentController.Instance;
        await commentControllerInstance.postComment(res, rating, seller, comment, req.user.id);
    });

};
