import mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    comment: String,
    rating: Number,
    seller: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
});

const Comment = mongoose.model('comments', CommentSchema);

module.exports = Comment;
