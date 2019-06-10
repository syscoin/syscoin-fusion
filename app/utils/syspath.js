const appData = process.env.APPDATA || (process.platform === 'darwin' ? `${process.env.HOME}/Library/Application Support` : '/var/local')
const path = require('path')
const OS = require('./detect-os')()

module.exports = () => {
    if (OS === 'win') {
        return path.join(appData, 'Syscoin')
    } else if (OS === 'osx') {
        return path.join(appData, 'Syscoin')
    } else if (OS === 'linux') {
        return path.join('~', '.syscoin')
    }
    return path.join(appData, 'Syscoin')
}
