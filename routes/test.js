const express = require('express');
const router = express.Router();
const temperatureRead = require('../app/temperature-reader');

router.get('/', async (req, res, next) => {
	const temperature = await temperatureRead();
	const text = `Temperatura: ${temperature.toFixed(2)} C`
	res.send(text);
});

module.exports = router;