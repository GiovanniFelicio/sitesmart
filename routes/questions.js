const express = require('express');
const routes = express.Router();
const {isAuth} = require('../helpers/middlewares');

const QuestionsController = require('../controllers/QuestionsController');
const TesteController = require('../controllers/TesteController');

routes.get('/groups/sub/questions/:id', QuestionsController.index);
routes.post('/groups/sub/questions', QuestionsController.create);
routes.get('/teste', TesteController.index);

module.exports = routes;