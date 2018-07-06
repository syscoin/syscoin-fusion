const fs = require('fs')

const writeToLogs = (text) => {
    const logSize = fs.statSync('/root/scripts/logs/usage-log.txt').size

    if (logSize > 200000000) {
        const arr = fs.readFileSync('/root/scripts/logs/usage-log.txt', 'utf8').split('\n')
        arr.shift()
        arr.push(text)
        const result = arr.join()
        fs.writeFileSync('/root/scripts/logs/usage-log.txt', result)
        return
    }
    fs.appendFileSync('/root/scripts/logs/usage-log.txt', text)
}

module.exports = writeToLogs
