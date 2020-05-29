const express = require('express');
const routes = express.Router();
const {isAuth} = require('../helpers/middlewares');

const QuestionnariesController = require('../controllers/QuestionnariesController');

routes.get('/questionnaries', isAuth, QuestionnariesController.index);
routes.post('/questionnaries', isAuth, QuestionnariesController.create);
routes.get('/questionnaries/add', isAuth, QuestionnariesController.add);
routes.get('/questionnaries/reply/:id', isAuth, QuestionnariesController.reply);
routes.get('/questionnaries/review/:id', isAuth, QuestionnariesController.review);
routes.get('/questionnaries/details/:id', isAuth, QuestionnariesController.details);
routes.post('/questionnaries/save', isAuth, QuestionnariesController.saveQuestionnaries);

module.exports = routes;