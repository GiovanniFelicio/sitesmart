const express = require('express');
const routes = express.Router();

const UserController = require('../controllers/UserController');

routes.get('/users', UserController.index);
routes.put('/users/:id', UserController.update);
routes.delete('/users/:id', UserController.delete);

module.exports = routes;