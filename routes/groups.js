const express = require('express');
const routes = express.Router();
const {isAuth} = require('../helpers/middlewares');

const GroupsController = require('../controllers/GroupsController');

routes.get('/groups', isAuth, GroupsController.index);
routes.post('/groups', isAuth, GroupsController.create);
routes.delete('/groups/:id', isAuth, GroupsController.delete);
routes.get('/groups/details/:idqnr/:idgroup', isAuth, GroupsController.details);

module.exports = routes;