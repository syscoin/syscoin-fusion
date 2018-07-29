const OS = require('./detect-os')()
const { execSync } = require('child_process')

module.exports = (returnPid) => {
    let result
    if (OS === 'win') {
        result = execSync('tasklist | findstr /C:"syscoin-qt.exe"').toString()
        return (/syscoin-qt\.exe\s+\d+/g).test(result)
    } else if (OS === 'osx') {
        result = execSync('ps -ax | grep Syscoin').toString()
        result = result.split(/\r?\n/g).find(i => i.indexOf('Contents/MacOS/Syscoin-Qt') !== -1)
        return returnPid ? (/\d+/).exec(result)[0] : !!result
    }
}
