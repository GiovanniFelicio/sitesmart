const express = require('express');
const routes = express.Router();
const {isAuth} = require('../helpers/middlewares');

const HomeController = require('../controllers/HomeController');

routes.get('/', HomeController.index);
routes.get('/home', isAuth, HomeController.home);
routes.post('/send', HomeController.sendMail);

module.exports = routes;