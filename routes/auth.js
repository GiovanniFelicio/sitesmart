const express = require('express');
const routes = express.Router();

const LoginController = require('../controllers/AuthControllers/LoginController');
const RegisterController = require('../controllers/AuthControllers/RegisterController');

routes.get('/login', LoginController.index);
routes.post('/login', LoginController.success);
routes.get('/register', RegisterController.index);
routes.post('/register', RegisterController.create);

routes.get('/logout', (req, res, next)=>{
    req.logout();
    req.flash('success_msg', 'Successfully Disconnected')
    res.redirect('/login');
});

module.exports = routes;