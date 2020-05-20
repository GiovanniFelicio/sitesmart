const express = require('express');
/*ROTAS*/
const authRoutes = require('./routes/auth');
const coursesRoutes = require('./routes/courses');
const homeRoutes = require('./routes/home');
const testRoutes = require('./routes/tests');
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

app.engine('handlebars', expressHandle({defaultLayout: 'default'}));
app.set('view engine', 'handlebars');

app.use(express.json());

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());

app.use([authRoutes, coursesRoutes, homeRoutes, usersRoutes, testRoutes]);

//Not  Found
app.use((req, res, next)=>{
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

//catch all
app.use((error, req, res, next)=>{
    res.status(error.status || 500);
    res.json({error: error.message});
});

app.listen(3333, ()=>{
    console.log('Server is running');
});