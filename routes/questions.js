const express = require('express');
const routes = express.Router();
const {isAuth} = require('../helpers/middlewares');

const QuestionsController = require('../controllers/QuestionsController');
routes.get('/groups/sub/questions/:id', QuestionsController.index);
routes.post('/groups/sub/questions', QuestionsController.create);
routes.post('/savequestion', QuestionsController.save);

module.exports = routes;