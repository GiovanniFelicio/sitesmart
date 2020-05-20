const express = require('express');
const routes = express.Router();
const {isAuth} = require('../helpers/middlewares');

const HomeController = require('../controllers/HomeController');

routes.get('/', isAuth, HomeController.index);

module.exports = routes;