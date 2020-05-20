const express = require('express');
const routes = express.Router();
const {isAuth} = require('../helpers/middlewares');

const CourseController = require('../controllers/CourseController');

routes.get('/courses', CourseController.index);
routes.post('/courses', CourseController.create);
routes.get('/delete/course/:id', CourseController.delete);

module.exports = routes;