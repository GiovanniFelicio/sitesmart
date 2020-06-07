const express = require('express');
const routes = express.Router();
const {isAuth} = require('../helpers/middlewares');

const QuestionsController = require('../controllers/QuestionsController');
routes.get('/groups/sub/questions/:id', isAuth, QuestionsController.index);
routes.post('/groups/sub/questions', isAuth, QuestionsController.create);
routes.delete('/groups/sub/questions/:id', isAuth, QuestionsController.delete);
routes.post('/savequestion', isAuth, QuestionsController.save);
routes.get('/question/model/:id', isAuth, QuestionsController.getmodel);
routes.post('/question/model', isAuth, QuestionsController.updateModel);
routes.delete('/question/model/:id/:type', isAuth, QuestionsController.deleteModel);
routes.get('/questions/:idqnr/:idsubgroup', isAuth, QuestionsController.details);
routes.get('/getquestion/:idquest/:idqnr', isAuth, QuestionsController.getquestion);

module.exports = routes;