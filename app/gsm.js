const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')

const SERIAL_MODULE_ADDRES = process.env.SERIAL_MODULE_ADDRES
const baudRate = 115200
let port;

const sleep = (ms = 100) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const write = async (line) => {
    port.write(`${line}\r\n`)
    await sleep()    
}

const init = async () => {
    if (port) { return }

    port = new SerialPort(SERIAL_MODULE_ADDRES, { baudRate })
    const lineStream = port.pipe(new Readline())
    lineStream.on('data', function (data) {
        console.log('M>', data.trim())
    })
    await write('AT')        
    await write('AT+CSQ') // Signal check    
}

/**
 * Send SMS
 * @param {Object} args - Function arguments
 * @param {String} args.text - Text to be send in SMS
 * @param {String} args.number - Prone number of reciver ( in format +XX123456789 where XX is country code)
 */
const sendSms = async ({ text, number }) => {
    console.log('SMS: ', text, number)
    await init()
    await write('AT+CMGF=1') // Select Message format as Text mode
    await write('AT+CNMI=2,1,0,0,0') // New SMS Message Indications
    await write(`AT+CMGS="${number}"`)
    await write(`${text}\x1A`)
    return true
}

/**
 * Make call and hang out after 30 s
 * @param {Object} args - Function arguments
 * @param {String} args.number - Prone number of reciver ( in format +XX123456789 where XX is country code)
 */
const makeCall = async ({ number }) => {
    await init()
    console.log('Call:', number)
    write(`ATD"${number}"`)
    sleep(30 * 1000) 
    write('ATH')
    return true
}

module.exports = {
    sendSms,
    makeCall
}