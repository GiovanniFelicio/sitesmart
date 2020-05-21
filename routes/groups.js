const express = require('express');
const routes = express.Router();
const {isAuth} = require('../helpers/middlewares');

const GroupsController = require('../controllers/GroupsController');

routes.get('/groups', GroupsController.index);
routes.post('/groups', GroupsController.create);

module.exports = routes;