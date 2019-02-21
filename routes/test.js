const express = require('express');
const router = express.Router();
const gsm = require('../app/gsm');
const temperatureRead = require('../app/temperature.reader');
const MAIN_PHONE_NUMBER = process.env.MAIN_PHONE_NUMBER


router.get('/', async (req, res, next) => {
	const temperature = await temperatureRead();
	const text = `Temperatura: ${temperature.toFixed(2)} C`
	// await gsm.sendSms({
	// 	text,
	// 	number: MAIN_PHONE_NUMBER
	// });	
	// await gsm.sendSms({
	// 	text,
	// 	number: MAIN_PHONE_NUMBER
	// });
	//  gsm.makeCall({
	// 	text,
	// 	number: MAIN_PHONE_NUMBER
	// });
	res.send(text);
});

module.exports = router;