const express = require('express');
const routes = express.Router();
const {isAuth} = require('../helpers/middlewares');

const UserController = require('../controllers/UserController');
routes.get('/users', isAuth, UserController.index);
routes.post('/users', isAuth, UserController.create);

module.exports = routes;