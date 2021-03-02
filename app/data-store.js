const temperatureRead = require('./temperature-reader');
const powerReader = require('./power-reader');
const TIMEOUT = 10 * 1000;

const store = {
    temperature: 50,
    powerValue: '',
}

const intervalUpdater = async () => {
    const temperature = await temperatureRead();
    const powerValue = await powerReader();
    store.temperature = temperature
    store.powerValue = powerValue
}

setInterval(intervalUpdater, TIMEOUT)
intervalUpdater()
module.exports = store
