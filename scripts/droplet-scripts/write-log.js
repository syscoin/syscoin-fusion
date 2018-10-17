const fs = require('fs')

const writeToLogs = (obj) => {
    let logPath = '/root/droplet-scripts/vps-node-log.txt';
    let logSize;
    let error, message;

    try {
        error = obj.error;
        message = obj.message;
        if (!message) {
            throw new Error('unable to extract message/error to log')
        }
    } catch (e) {
        throw new Error(`invalid error object sent to logger. ERROR: ${e}`)
    }

    const text = `${(new Date()).toString()}: Message: ${message} | Error: ${error}\n`

    try {
        logSize = fs.statSync(logPath).size
    } catch (e) {
        logSize = 0
        fs.closeSync(fs.openSync(logPath, 'w'));
    }

    if (logSize > 200000000) {
        const arr = fs.readFileSync(logPath, 'utf8').split('\n')
        arr.shift()
        arr.push(text)
        const result = arr.join()
        fs.writeFileSync(logPath, result)
        return
    }
    fs.appendFileSync(logPath, text)
}

module.exports = writeToLogs
