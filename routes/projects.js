const express = require('express');
const routes = express.Router();

const ProjectsController = require('../controllers/ProjectsController');

routes.get('/projects', ProjectsController.index);
routes.post('/projects', ProjectsController.create);

module.exports = routes;