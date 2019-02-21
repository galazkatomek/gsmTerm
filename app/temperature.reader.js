const fs = require('fs');
const TERM_ADDRES = process.env.TERM_ADDRES
const tConst = 't=';

/**
 * Parse data from sensor
 * @param {Sting} sensorText 
 * @returns {Number} - Temperature read in °C
 */
const parseSensorData = (sensorText) => {	
	if (sensorText.indexOf(tConst) < 0) {
		return;
	}
    const temperatureStr = sensorText.substring(sensorText.indexOf(tConst) + 2, sensorText.length);    
	return ((parseInt(temperatureStr) / 1000) - 2);
}

/**
 * Read temperature from sensor
 * @returns {Promise<Number>} - Temperature read in °C
 */
const temperatureReader = async () => {
    return new Promise((resolve, reject) => {
        fs.readFile(TERM_ADDRES, (err, data) => {
            if (err) throw err;
            resolve(parseSensorData(data.toString()));
        });
    });
}

module.exports = temperatureReader

