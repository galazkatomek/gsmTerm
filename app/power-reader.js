const ina219 = require('ina219');
const INA219_ADDRESS = 0x42;
ina219.init(INA219_ADDRESS);
ina219.enableLogging(true);
/**
 * Read power status
 * @returns {Promise<Object>} - String with config
 */
const powerReader = async () => {
    return new Promise((resolve) => {
        ina219.calibrate32V1A(function () {
            ina219.getBusVoltage_V(function (volts) {
                console.log('[ina219] Voltage: ', volts);
                ina219.getCurrent_mA(function (current) {
                    console.log('[ina219] Current (mA): ', current);
                    resolve(`Napięcię: ${volts}; Natężenie: ${current}`)
                });
            });
        });
    });
}

module.exports = powerReader