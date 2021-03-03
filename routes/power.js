const express = require('express');
const router = express.Router();
const dataStore = require('../app/data-store');


router.get('/', async (req, res, next) => {
	const temperature = dataStore.temperature
	const powerValue =  dataStore.powerValue
	const powerSource = powerValue.isOnBattery ? 'bateryjne' : 'sieciowe'
	const powerString = `Zasilanie: ${powerSource}; Bateria: ${powerValue.percent.toFixed()}%; Natężenie: ${powerValue.current} mA;`;

	const text = `${powerString}; Temperatura: ${temperature.toFixed(2)} C`
	res.send(text);
});

module.exports = router;