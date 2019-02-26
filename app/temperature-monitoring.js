var moment = require('moment');

const GsmHandler = require('./gsm');
const temperatureRead = require('./temperature-reader');

const MAIN_PHONE_NUMBER = process.env.MAIN_PHONE_NUMBER;
const ADMIN_PHONE_NUMBER = process.env.ADMIN_PHONE_NUMBER;

const ALLOWED_CALL_NUMBERS = process.env.ALLOWED_CALL_NUMBERS.split(' ');
const MIN_ALLOWED_TEMPERATURE = parseFloat(process.env.MIN_ALLOWED_TEMPERATURE);
const TIMEOUT = 60 * 1000;

let gsm;
let lastAlarmTime;

const generateTemperatureSms = (temperature) => {
    return `Temperatura: ${temperature.toFixed(2)} C`
}

const sendTemperatureSms = async (temperature, number = MAIN_PHONE_NUMBER) => {
    if (!temperature) { temperature = await temperatureRead() }

    await gsm.sendSms({
        text: generateTemperatureSms(temperature),
        number
    });
}
const makeAlarmCall = async (number = MAIN_PHONE_NUMBER) => {
    await gsm.makeCall({
        number
    });
}

const lowTemperatureAlarm = async (temperature) => {
    if (lastAlarmTime && lastAlarmTime.isAfter(moment().subtract(20, 'minutes'))) {
        // make 20 minutes stop between alarms
        return;
    }

    await sendTemperatureSms(temperature)
    await makeAlarmCall()
    lastAlarmTime = moment()
}


const intervalCheck = async () => {
    const temperature = await temperatureRead()
    if (temperature <= MIN_ALLOWED_TEMPERATURE) {
        await lowTemperatureAlarm();
    }
}

const intervalLogger = async () => {
    const temperature = await temperatureRead()
}

const onIcomingCallCb = async (callerId) => {
    console.log('callerId', callerId)
    if (ALLOWED_CALL_NUMBERS.includes(callerId)) {
        await sendTemperatureSms(null, callerId)
    } else {
        console.warn('Unknow caller: ', callerId)
    }
}

const onSingalCheckCb = async (signal) => {
    console.log('Signal: ', signal)
    const MAX_SINGAL = 31.0
    const signalPercentage = (parseFloat(signal) / MAX_SINGAL) * 100
    const temperature = await temperatureRead()
    const text = `Sygnal: ${ signalPercentage.toFixed(2) }%; ${ generateTemperatureSms(temperature) }`

    setTimeout(() => {
        gsm.sendSms({
            text,
            number: ADMIN_PHONE_NUMBER
        })
    }, 2000)
}

const temperatureMonitoring = () => {
    gsm = new GsmHandler(onIcomingCallCb, onSingalCheckCb);
    setInterval(intervalCheck, TIMEOUT)
    setInterval(intervalLogger, TIMEOUT)

    console.log('Monitoring initialization, min temperature allowed:', MIN_ALLOWED_TEMPERATURE)
}

module.exports = temperatureMonitoring