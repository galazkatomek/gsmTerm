require('dotenv').config()
require('./console-setup');
const createError = require('http-errors');
const compression = require('compression')
const nocache = require('nocache');

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const temperatureRouter = require('./routes/temperature');
const testRouter = require('./routes/test');
const powerRouter = require('./routes/power');

const temperatureMonitoring = require('./app/temperature-monitoring');
const powerReader = require('./app/power-reader');

const app = express();
app.use(compression());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/temperature', temperatureRouter);
app.use('/test', testRouter);
app.use('/power', powerRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(nocache());

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// temperatureMonitoring();
// powerReader();
console.log('App started! mode:', process.env.NODE_ENV);

// require('./app/data-store');
module.exports = app;
