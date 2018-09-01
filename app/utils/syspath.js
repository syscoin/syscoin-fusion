const appData = process.env.APPDATA || (process.platform === 'darwin' ? `${process.env.HOME}Library/Preferences` : '/var/local')
const path = require('path')
const OS = require('./detect-os')()

module.exports = () => {
    if (OS === 'win') {
        return path.join(appData, 'SyscoinCore')
    } else if (OS === 'osx') {
        return path.join(appData, 'SyscoinCore')
    } else if (OS === 'linux') {
        return path.join('~', '.syscoincore')
    }
    return path.join(appData, 'SyscoinCore')
}
