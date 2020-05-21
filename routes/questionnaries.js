const express = require('express');
const routes = express.Router();
const {isAuth} = require('../helpers/middlewares');

const QuestionnariesController = require('../controllers/QuestionnariesController');

routes.get('/questionnaries', QuestionnariesController.index);
routes.get('/questionnaries/add', QuestionnariesController.add);

module.exports = routes;