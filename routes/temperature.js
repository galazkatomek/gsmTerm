const express = require('express');
const router = express.Router();
const temperatureRead = require('../app/temperature.reader');

router.get('/',async (req, res, next) => {
	const temperature = await temperatureRead();
	res.send(temperature.toFixed(2));
});

module.exports = router;
