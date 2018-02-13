import mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    author: String,
    content: String,
    rating: Number,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
});

const Comment = mongoose.model('comments', CommentSchema);

module.exports = Comment;

