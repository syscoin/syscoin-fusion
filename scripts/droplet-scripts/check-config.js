const axios = require('axios')
const fs = require('fs')
const {execSync} = require('child_process')
const writeToLogs = require('./write-log')
const makeConfig = require('./helpers/default-config')
const config = require('./config')

const Storage = require('./db')
const chainConfig = require('/root/chain-config')

const appUrl = config.appUrl + '/droplets/get-mn-data'

let syscoinFile

try {
    syscoinFile = fs.readFileSync(chainConfig.path(), 'utf-8')
} catch (e) {
    syscoinFile = ''
}


axios.get(appUrl).then(res => {
    const data = res.data

    writeToLogs({
        message: 'Received config: ' + JSON.stringify(data),
        error: false
    })

    if (syscoinFile === '' || syscoinFile.indexOf(data.mnKey) === -1 || syscoinFile.indexOf(data.ip) === -1) {
        fs.writeFileSync(chainConfig.path(), chainConfig.config(data.mnKey, data.ip))
        writeToLogs({
            error: false,
            message: 'Updated config to MnKey: ' + data.mnKey + ' and IP: ' + data.ip
        })
        execSync('sudo reboot')
    }

    // Save response to local DB
    Storage.setItem('vpsInfo', data)

    process.exit()
}).catch(() => {
    writeToLogs({
        error: false,
        message: 'Something went wrong while checking the data.'
    })
    process.exit()
})
