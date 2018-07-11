const axios = require('axios')
const fs = require('fs')
const { execSync } = require('child_process')
const writeToLogs = require('./write-log')
const makeConfig = require('./helpers/default-config')

const appUrl = 'https://us-central1-mm-dev-v2.cloudfunctions.net/app/droplets/get-mn-data'

const formatter = (obj) => `${(new Date()).toString()}: Message: ${obj.message} | Error: ${obj.error}\n`

const syscoinFile = fs.readFileSync('/root/.syscoincore/syscoin.conf', 'utf-8')

axios.get(appUrl).then(res => {
    const data = res.data

    if (syscoinFile.indexOf(data.mnKey) === -1 || syscoinFile.indexOf(data.ip) === -1) {
        fs.writeFileSync('/root/.syscoincore/syscoin.conf', makeConfig(data.mnKey, data.ip))
        writeToLogs({
            error: false,
            message: 'Updated config to MnKey: ' + data.mnKey + ' and IP: ' + data.ip
        })
        execSync('sudo reboot')
    }

    process.exit()
}).catch(res => {
    console.log(res.data)
    writeToLogs({
        error: false,
        message: 'Something went wrong while checking the data.'
    })
    process.exit()
})
