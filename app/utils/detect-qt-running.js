const OS = require('./detect-os')()
const { execSync } = require('child_process')

module.exports = () => {
    let result
    if (OS === 'win') {
        result = execSync('tasklist | findstr /C:"syscoin-qt.exe"').toString()
        return (/syscoin-qt\.exe\s+\d+/g).test(result)
    } else if (OS === 'osx') {
        result = execSync('ps -ax | grep Syscoin-qt').toString()
        console.log(result)
        return (/syscoin-qt\.exe\s+\d+/g).test(result)
    }
}
