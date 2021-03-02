const ina219 = require('ina219');

/**
 * Read power status
 * @returns {Promise<Object>} - Object with config
 */
const powerReader = async () => {
    ina219.init();
    ina219.enableLogging(true);

    ina219.calibrate32V1A(function () {
        ina219.getBusVoltage_V(function (volts) {
            console.log('[ina219] Voltage: ', volts);
            ina219.getCurrent_mA(function (current) {
                console.log('[ina219] Current (mA): ', current);
            });
        });
    });
    return ina219
}

module.exports = powerReader