"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const MailingListSchema = new mongoose.Schema({
    email: String,
    responded: { type: Boolean, default: false }
});
const surveySchema = new mongoose.Schema({
    title: String,
    body: String,
    subject: String,
    surveyMailingList: [MailingListSchema],
    yes: { type: Number, default: 0 },
    no: { type: Number, default: 0 },
    surveyOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    dateSent: Date,
    lastResponded: Date
});
mongoose.model('surveys', surveySchema);
//# sourceMappingURL=Survey.js.map