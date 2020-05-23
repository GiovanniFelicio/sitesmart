const express = require('express');
const routes = express.Router();
const {isAuth} = require('../helpers/middlewares');

const QuestionsController = require('../controllers/QuestionsController');
const TesteController = require('../controllers/TesteController');

routes.get('/groups/sub/questions/:id', isAuth, QuestionsController.index);
routes.post('/groups/sub/questions', isAuth, QuestionsController.create);
routes.get('/teste', TesteController.index);
routes.post('/savequestion', isAuth, QuestionsController.save);

module.exports = routes;