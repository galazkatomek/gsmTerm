const express = require('express');
const fs = require('fs');
const router = express.Router();

const parseSensorData = (tempText) => {
	const tConst = 't=';
	if (tempText.indexOf(tConst) < 0) {
		return;
	}
	const temp1 = tempText.substring(tempText.indexOf(tConst) + 2, tempText.length);
	return '' + ((temp1 / 1000) - 2);
}

router.get('/', (req, res, next) => {
	// fs.readFile('fake.teperature.txt', (err, data) => {
	fs.readFile('/sys/bus/w1/devices/28-0000095c9ffc/w1_slave', (err, data) => {
		if (err) throw err;
		res.send(parseSensorData(data.toString()));
	});

});

module.exports = router;
