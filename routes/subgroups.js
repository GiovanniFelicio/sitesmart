const express = require('express');
const routes = express.Router();
const {isAuth} = require('../helpers/middlewares');

const SubGroupsController = require('../controllers/SubGroupsController');

routes.get('/groups/sub/:id', isAuth, SubGroupsController.index);
routes.post('/groups/sub', isAuth, SubGroupsController.create);

module.exports = routes;