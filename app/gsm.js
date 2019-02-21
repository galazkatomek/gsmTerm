const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')

const SERIAL_MODULE_ADDRES = process.env.SERIAL_MODULE_ADDRES
const BAUD_RATE = 115200
const SIGNAL_STRENTCH =  '+CSQ: '
const SMS_SEND = '+CMGS:'
const CMS_ERROR = '+CMS ERROR:'
const INCOMING_CALL = '+CLIP:'
//M> +CLIP: "48501406222",145,,,,1
let port;
let smsBlockadePromis
let onSmsSendCb

let onSingalCheckCb
let onIcomingCallCb

const sleep = (ms = 100) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const write = async (line) => {
    port.write(`${line}\r\n`)
    await sleep()    
}

/**
 * 
 * @param {String} data - line of data
 */
const onData = (data) => {
    console.log('M>', data)
    if (data.includes(SIGNAL_STRENTCH)){
        const signalStrentch = data.split(SIGNAL_STRENTCH).pop()
        console.log('Signal:', signalStrentch)
        onSingalCheckCb && onSingalCheckCb(signalStrentch)
    } else if (data.includes(SMS_SEND)){
        onSmsSendCb && onSmsSendCb(true)
    } else if (data.includes(CMS_ERROR)){
         
    } else if (data.includes(INCOMING_CALL)){
        const rawData = data.split(INCOMING_CALL).pop()
        const callerId = rawData.split('"')[1]    
        console.log('callerId: ', callerId)
        onIcomingCallCb && onIcomingCallCb(callerId)
    }

    
    
}

const init = async () => {
    if (port) { return }

    port = new SerialPort(SERIAL_MODULE_ADDRES, { baudRate: BAUD_RATE })
    const lineStream = port.pipe(new Readline())
    lineStream.on('data', onData)
    await write('AT')        
    await write('AT+CSQ') // Signal check    
    await write('AT+CLIP=1') // Display Caller id
}

/**
 * Send SMS
 * @param {Object} args - Function arguments
 * @param {String} args.text - Text to be send in SMS
 * @param {String} args.number - Prone number of reciver ( in format +XX123456789 where XX is country code)
 */
const sendSms = async ({ text, number }) => {
    await smsBlockadePromis
    console.log('SMS:', text, number)
    await init()
    await write('AT+CMGF=1') // Select Message format as Text mode
    await write('AT+CNMI=2,1,0,0,0') // New SMS Message Indications
    await write(`AT+CMGS="${number}"`)
    await write(`${text}\x1A`)
    // Wait for confirmation that SMS was send    
    smsBlockadePromis = new Promise(async (resolve) => {
        onSmsSendCb = resolve
        await sleep(30 * 1000)
        // Optional timout if SMS send fail
        onSmsSendCb && onSmsSendCb(false)
    });
    const smsStatus = await smsBlockadePromis
    smsBlockadePromis = null
    onSmsSendCb = null
    console.log(`SMS SEND: ${smsStatus}`)
    return smsStatus
}

/**
 * Make call and hang out after 30 s
 * @param {Object} args - Function arguments
 * @param {String} args.number - Prone number of reciver ( in format +XX123456789 where XX is country code)
 */
const makeCall = async ({ number }) => {
    await init()
    console.log('Call:', number)
    await write(`ATD"${number}"`)
    await sleep(30 * 1000) 
    await write('ATH')
    return true
}

module.exports = {
    init,
    sendSms,
    makeCall
}