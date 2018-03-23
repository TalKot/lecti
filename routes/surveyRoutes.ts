// const _ = require('lodash');
// const Path = require('path-parser');
// const URL = require('url');
// import * as mongoose from 'mongoose';
// const requireLogin = require('../middlewares/requireLogin');
// const Mailer = require('../services/emailsNotifications/Mailer');
// const surveyTemplate = require('../services/emailsNotifications/emailTemplates/surveyTemplate');
// const Survey = mongoose.model('surveys');
//
// module.exports = app => {
//
//     app.get('/api/surveys', requireLogin, async (req, res) => {
//         const surveys = await Survey.find({_user: req.user.id}).select({
//             recipients: false
//         });
//
//         res.send(surveys);
//     });
//
//     app.get('/api/surveys/:surveyId/:choice', (req, res) => {
//         res.send('Thanks for voting!');
//     });
//
//
//     app.post('/api/surveys', requireLogin, async (req, res) => {
//
//         const {title, subject, body, recipients} = req.body;
//
//         const survey = new Survey({
//             title,
//             subject,
//             body,
//             surveyMailingList: recipients.split(',').map(email => ({email: email.trim()})),
//             surveyOwner: req.user.id,
//             dateSent: Date.now()
//         });
//         try {
//             const mailer = new Mailer(survey, surveyTemplate(survey));
//             await Promise.all([mailer.send(), survey.save()]);
//             res.send(req.user);
//         } catch (err) {
//             res.status(422).send(err);
//         }
//     });
//
//     //TODO : REMOVE THIS TO A DIFFRENT ROUTE FILE
//     app.post('/api/becomeseller/', requireLogin, async (req, res) => {
//
//         const {title, subject, body, recipients} = req.body;
//
//         const survey = new Survey({
//             title,
//             subject,
//             body,
//             surveyMailingList: recipients.split(',').map(email => ({email: email.trim()})),
//             surveyOwner: req.user.id,
//             dateSent: Date.now()
//         });
//         try {
//             const mailer = new Mailer(survey, surveyTemplate(survey));
//             await Promise.all([mailer.send(), survey.save()]);
//             res.send(req.user);
//         } catch (err) {
//             res.status(422).send(err);
//         }
//     });
// };
