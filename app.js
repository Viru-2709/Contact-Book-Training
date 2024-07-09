var createError = require('http-errors');
var express = require('express');
var path = require('path');
var session = require('express-session');
var userRouter = require('./routes/user.route');
var contactRouter = require('./routes/contact.route');
var groupRouter = require('./routes/group.route');
const blockIP = require('./middleware/blockip.middleware');
const unBlockIP = require('./middleware/unblockip.middelewere');
const userAuth = require('./middleware/user.middleware');
const { logRequest } = require('./logger/logger');
require('dotenv').config();
const passport = require('passport');
require('./passport');

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log('Connected!'))
  .catch((error) => {
    console.log(error.message);
  });

var app = express();

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

app.use(passport.initialize());
app.use(passport.session());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/resources/assets', express.static(__dirname + '/resources/assets'));
app.use('/public/assets', express.static(__dirname + '/public/assets'));
app.use('/', unBlockIP.unblockIP, blockIP.blockIP, userRouter);
app.use('/user/contact', userAuth.userAuthentication, unBlockIP.unblockIP, blockIP.blockIP, contactRouter);
app.use('/user/group', userAuth.userAuthentication, unBlockIP.unblockIP, blockIP.blockIP, groupRouter);

app.use((req, res, next) => {
  req.logger = logRequest;
  next();
});

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;