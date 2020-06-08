const express = require('express');
const routes = express.Router();
const {isAuth} = require('../helpers/middlewares');

const QuestionnariesController = require('../controllers/QuestionnariesController');

routes.get('/questionnaries', isAuth, QuestionnariesController.index);
routes.post('/questionnaries', isAuth, QuestionnariesController.create);
routes.get('/questionnaries/add', isAuth, QuestionnariesController.add);
routes.get('/questionnaries/groups/:id', isAuth, QuestionnariesController.replyReviewGroups);
routes.get('/questionnaries/question/:idqnr/:idsub', isAuth, QuestionnariesController.replyReviewQuestions);
routes.get('/questionnaries/details/:id', isAuth, QuestionnariesController.details);
routes.get('/questionnaries/getscores/:id', isAuth, QuestionnariesController.getScores);
routes.get('/questionnaries/getresult/:id', isAuth, QuestionnariesController.results);
routes.post('/questionnaries/save', isAuth, QuestionnariesController.saveQuestionnaries);

module.exports = routes;