const express = require('express');
const mustache = require('mustache-express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');

const { user } = require('./models/database');

const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

const router = require('./routes/index');
const helpers = require('./helpers');
const errorHandler = require('./handlers/errorHandler');

require('dotenv').config({path:'variables.env'});

//Config
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static(__dirname+'/public'));

app.use(cookieParser(process.env.SECRET));
app.use(session({
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:false
}));
app.use(flash());

app.use((req, res, next) => {
    res.locals.h = helpers;
    res.locals.flashes = req.flash();
    next();
});

/*
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(con.authenticate()));
passport.serializeUser(con.serializeUser());
passport.deserializeUser(con.deserializeUser());
*/

app.use('/', router);

//Error 404
app.use(errorHandler.pageNotFound);

app.engine('mst', mustache(__dirname+'/views/partials', '.mst'));
app.set('view engine', 'mst');
app.set('views', __dirname + '/views/pages');

module.exports = app;