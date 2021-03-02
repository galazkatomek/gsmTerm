const express = require('express');
const router = express.Router();
const temperatureRead = require('../app/temperature-reader');
const powerReader = require('../app/power-reader');

router.get('/', async (req, res, next) => {
	const temperature = await temperatureRead();
	const powerReader = await powerReader();
	const text = `${powerReader}; Temperatura: ${temperature.toFixed(2)} C`
	res.send(text);
});

module.exports = router;