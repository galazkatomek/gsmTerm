const express = require('express');
const router = express.Router();
const gsm = require('../app/gsm');
const temperatureRead = require('../app/temperature.reader');

router.get('/', async (req, res, next) => {
	const temperature = await temperatureRead();
	const text = `Temperatura: ${temperature.toFixed(2)} C`
	const response = 'OK ' + await gsm.sendSms({
		text,
		number: '+48501406222'
	});
	res.send(response + ' '+text);
});

module.exports = router;