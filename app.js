const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
require("babel-register");
let cors = require('cors')
let config = require('./config/config');
let env = require('node-env-file');
let helpers = require('./app/helpers/helpers');
let bodyParser = require('body-parser');
env(__dirname + '/.env');

const app = express();

app.use(cors({
  credentials: true,
  origin: true
}));

const bodyParserJsonMiddleware = function () {
  return function (req, res, next) {
    if (helpers.isMultipartRequest(req)) {
      return next();
    }
    return bodyParser.json()(req, res, next);
  };
};

app.use(bodyParserJsonMiddleware());
app.all('*', (req, res, next) => {
  let origin = req.get('origin');
  res.header('Access-Control-Allow-Origin', origin);
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

module.exports = require('./config/express')(app, config);
app.listen(config.port, () => {
  console.log('Express server listening on port ' + config.port);
});

app.all('*', (req, res, next) => {
  let origin = req.get('origin');
  res.header('Access-Control-Allow-Origin', origin);
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
