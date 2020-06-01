const express = require('express');
/*ROTAS*/
const authRoutes = require('./routes/auth');
const homeRoutes = require('./routes/home');
const groupsRoutes = require('./routes/groups');
const subgroupsRoutes = require('./routes/subgroups');
const questionsRoutes = require('./routes/questions');
const questionnariesRoutes = require('./routes/questionnaries');
const usersRoutes = require('./routes/users');

const app = express();
const expressHandle = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const cookie = require('cookie-parser');
const passport = require('passport');
require('./config/auth')(passport);
app.use(cookie());
app.use(session({
    secret: 'dwdjk#n152478D4DSFF4&bd!vy&',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});
app.use(express.static(path.join(__dirname, 'static')));

app.engine('handlebars', expressHandle({defaultLayout: 'default',
                                        extname: '.handlebars',
                                        helpers: require('./helpers/conditions.js') //only need this}
                                    }));
app.set('view engine', 'handlebars');


app.use(express.json());

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());

app.use([authRoutes, homeRoutes, groupsRoutes, subgroupsRoutes, questionsRoutes, questionnariesRoutes, usersRoutes]);

//Not  Found
app.use((req, res, next)=>{
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

//catch all
app.use((error, req, res, next)=>{
    res.status(error.status || 500);
    if(error.status == 404){
        res.render('errors/404',{
            layout: '',
            style: ['styles/style.css'],
        });
    }
    else if(error.status == 403){
        res.render('errors/403',{
            layout: '',
            style: ['styles/style.css'],
        });
    }
    else if(error.status == 500){
        res.render('errors/500',{
            layout: '',
            style: ['styles/style.css'],
        });
    }
});

app.listen(3333, ()=>{
    console.log('Server is running');
});