var express = require('express');
var moment = require('moment');
var router = express.Router();

const temperatureRead = require('../app/temperature-reader');

module.exports = router;

/* GET home page. */
router.get('/', async (req, res, next) => {
  const temperature = (await temperatureRead()).toFixed(2);  
  const time = moment().format('HH:mm:ss')
  res.render('index', {
    title: 'Termometr GSM',
    temperature,
    time
  });
});

module.exports = router;
