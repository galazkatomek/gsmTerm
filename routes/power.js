const express = require('express');
const router = express.Router();
const temperatureRead = require('../app/temperature-reader');
const powerReader = require('../app/power-reader');

router.get('/', async (req, res, next) => {
	const temperature = await temperatureRead();
	const powerValue = await powerReader();
	const powerSource = powerValue.isOnBattery ? 'bateryjne' : 'sieciowe'
	const powerString = `Zasilanie: ${powerSource}; Bateria: ${powerValue.percent.toFixed()}`;

	const text = `${powerString}; Temperatura: ${temperature.toFixed(2)} C`
	res.send(text);
});

module.exports = router;