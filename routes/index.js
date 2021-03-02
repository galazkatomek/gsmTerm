var express = require('express');
var moment = require('moment');
var router = express.Router();

const dataStore = require('../app/data-store');

module.exports = router;

/* GET home page. */
router.get('/', async (req, res, next) => {
  const temperature = (dataStore.temperature).toFixed(2);
  const time = moment().format('HH:mm:ss')
  const powerValue =  dataStore.powerValue
  const powerSource = powerValue.isOnBattery ? 'bateryjne' : 'sieciowe'
  const powerString = `Zasilanie: ${powerSource}; Bateria: ${powerValue.percent.toFixed()}`;

  res.render('index', {
    title: 'Termometr GSM',
    temperature,
    time,
    powerString,
    isOnBattery: powerValue.isOnBattery
  });
});

module.exports = router;
