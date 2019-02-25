const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')

const SERIAL_MODULE_ADDRES = process.env.SERIAL_MODULE_ADDRES
const BAUD_RATE = 115200
const SIGNAL_STRENTCH = '+CSQ: '
const SMS_SEND = '+CMGS:'
const CMS_ERROR = '+CMS ERROR:'
const INCOMING_CALL = '+CLIP:'

const sleep = (ms = 100) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class GsmHandler {

    constructor(onIcomingCallCb, onSingalCheckCb) {
        this.onIcomingCallCb = onIcomingCallCb;        
        this.onSingalCheckCb = onSingalCheckCb;
        this.port = null;
        this.smsBlockadePromis = null;
        this.onSmsSendCb = null;
        this.init()
    }

    //M> +CLIP: "48501406222",145,,,,1
    async write(line) {
        this.port.write(`${line}\r\n`)
        await sleep()
    }

    /**
     * 
     * @param {String} data - line of data
     */
    onData(data) {
        console.log('M>', data)
        if (data.includes(SIGNAL_STRENTCH)) {
            const signalStrentch = data.split(SIGNAL_STRENTCH).pop()
            if (this.onSingalCheckCb) { this.onSingalCheckCb(signalStrentch) }
        } else if (data.includes(SMS_SEND)) {
            this.onSmsSendCb && this.onSmsSendCb(true)
        } else if (data.includes(CMS_ERROR)) {

        } else if (data.includes(INCOMING_CALL)) {
            const rawData = data.split(INCOMING_CALL).pop()
            const callerId = rawData.split('"')[1]            
            if (this.onIcomingCallCb) { this.onIcomingCallCb(callerId) }            
        }
    }

    async init() {
        if (this.port) { return }

        console.log('INIT')
        this.port = new SerialPort(SERIAL_MODULE_ADDRES, { baudRate: BAUD_RATE })
        const lineStream = this.port.pipe(new Readline())
        lineStream.on('data', this.onData.bind(this))
        await this.write('AT')
        await sleep(200)
        await this.write('AT+CSQ') // Signal check    
        await this.write('AT+CLIP=1') // Display Caller id
    }

    /**
     * Send SMS
     * @param {Object} args - Function arguments
     * @param {String} args.text - Text to be send in SMS
     * @param {String} args.number - Prone number of reciver ( in format +XX123456789 where XX is country code)
     */
    async sendSms({ text, number }) {        
        await this.smsBlockadePromis
        console.log('SMS:', text, number)      
        await this.write('AT+CMGF=1') // Select Message format as Text mode
        await this.write('AT+CNMI=2,1,0,0,0') // New SMS Message Indications
        await this.write(`AT+CMGS="${number}"`)
        await this.write(`${text}\x1A`)
        // Wait for confirmation that SMS was send    
        this.smsBlockadePromis = new Promise(async (resolve) => {
            this.onSmsSendCb = resolve
            await sleep(30 * 1000)
            // Optional timout if SMS send fail
            this.onSmsSendCb && this.onSmsSendCb(false)
        });
        const smsStatus = await this.smsBlockadePromis
        this.smsBlockadePromis = null
        this.onSmsSendCb = null
        console.log(`SMS SEND: ${smsStatus}`)
        return smsStatus
    }

    /**
     * Make call and hang out after 30 s
     * @param {Object} args - Function arguments
     * @param {String} args.number - Prone number of reciver ( in format +XX123456789 where XX is country code)
     */
    async makeCall({ number }) {
        await this.init()
        console.log('Call:', number)
        await this.write(`ATD"${number}"`)
        await sleep(30 * 1000)
        await this.write('ATH')
        return true
    }
}
module.exports = GsmHandler