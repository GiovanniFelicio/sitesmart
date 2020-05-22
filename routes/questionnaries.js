const express = require('express');
const routes = express.Router();
const {isAuth} = require('../helpers/middlewares');

const QuestionnariesController = require('../controllers/QuestionnariesController');

routes.get('/questionnaries', QuestionnariesController.index);
routes.post('/questionnaries', QuestionnariesController.create);
routes.get('/questionnaries/add', QuestionnariesController.add);
routes.get('/questionnaries/reply/:id', QuestionnariesController.reply);

module.exports = routes;