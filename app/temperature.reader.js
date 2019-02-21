const fs = require('fs');
const TERM_ADDRES = process.env.TERM_ADDRES
const T_CONST = 't=';

/**
 * Parse data from sensor
 * @param {Sting} sensorText 
 * @returns {Number} - Temperature read in °C
 */
const parseSensorData = (sensorText) => {
    if (!sensorText.includes(T_CONST)){
        return;
    }
    const temperatureStr = sensorText.split(T_CONST).pop()	    
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

