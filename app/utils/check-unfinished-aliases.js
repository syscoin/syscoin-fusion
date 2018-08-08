const { exec } = require('child_process')
const generateCmd = require('./cmd-gen')

module.exports = () => {
    const actualBlock = global.appStorage.get('walletinfo').blocks
}