const express = require('express');
const routes = express.Router();

const TesteController = require('../controllers/TesteController');

routes.get('/posts', TesteController.index);
routes.get('/add', TesteController.formCreate);
routes.post('/posts', TesteController.create);

module.exports = routes;