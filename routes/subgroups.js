const express = require('express');
const routes = express.Router();
const {isAuth} = require('../helpers/middlewares');

const SubGroupsController = require('../controllers/SubGroupsController');

routes.get('/groups/sub/:id', SubGroupsController.index);
routes.post('/groups/sub', SubGroupsController.create);

module.exports = routes;