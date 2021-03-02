const ina219 = require('ina219');
const INA219_ADDRESS = 0x42;
ina219.init(INA219_ADDRESS);
ina219.enableLogging(true);

const busVoltageToPercent = (busVoltage) => {
    const percentBase = (busVoltage - 6) / 2.4 * 100;
    if (percentBase > 100) {
        return 100
    }
    if (percentBase < 0) {
        return 100
    }
    return percentBase
}
/**
 * Read power status
 * @returns {Promise<Object>} - Object with config
 */
const powerReader = async () => {
    return new Promise((resolve) => {
        ina219.calibrate32V2A(function () {
            ina219.getCurrent_mA(function (current) {
                console.log('[ina219] Current (mA): ', current);
                ina219.getBusVoltage_V(function (busVoltage) {
                    const percent = busVoltageToPercent(busVoltage)
                    resolve({
                        percent,
                        isOnBattery: current < 0
                    })
                });
            });
        });
    });

}

module.exports = powerReader
