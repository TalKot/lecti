"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const _ = require('lodash');
const Path = require('path-parser');
const URL = require('url');
const mongoose = require("mongoose");
const requireLogin = require('../middlewares/requireLogin');
const Mailer = require('../services/emailsNotifications/Mailer');
const surveyTemplate = require('../services/emailsNotifications/emailTemplates/surveyTemplate');
const Survey = mongoose.model('surveys');
module.exports = app => {
    app.get('/api/surveys', requireLogin, (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        const surveys = yield Survey.find({ _user: req.user.id }).select({
            recipients: false
        });
        res.send(surveys);
    }));
    app.get('/api/surveys/:surveyId/:choice', (req, res) => {
        res.send('Thanks for voting!');
    });
    app.post('/api/surveys', requireLogin, (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        const { title, subject, body, surveyMailingList } = req.body;
        const survey = new Survey({
            title,
            subject,
            body,
            surveyMailingList: surveyMailingList.split(',').map(email => ({ email: email.trim() })),
            surveyOwner: req.user.id,
            dateSent: Date.now()
        });
        try {
            const mailer = new Mailer(survey, surveyTemplate(survey));
            yield Promise.all([mailer.send(), survey.save()]);
            res.send(req.user);
        }
        catch (err) {
            res.status(422).send(err);
        }
    }));
};
//# sourceMappingURL=surveyRoutes.js.map