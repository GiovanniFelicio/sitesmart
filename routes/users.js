const express = require('express');
const routes = express.Router();
const {isAuth} = require('../helpers/middlewares');

const UserController = require('../controllers/UserController');
routes.get('/users', UserController.index);
routes.post('/users', UserController.create);

module.exports = routes;