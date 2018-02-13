"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const User = require('./User');
const surveySchema = new mongoose.Schema({
    title: String,
    body: String,
    subject: String,
    User: [User],
    yes: { type: Number, default: 0 },
    no: { type: Number, default: 0 },
    _user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    dateSent: Date,
    lastResponded: Date
});
mongoose.model('surveys', surveySchema);
//# sourceMappingURL=Survey.js.map