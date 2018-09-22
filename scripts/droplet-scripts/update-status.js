const axios = require('axios')
const { exec } = require('child_process')
const writeToLogs = require('./write-log')
const config = require('./config')

const appUrl = config.appUrl + '/droplets/edit-status'
const cliDir = '~/syscoin/src/syscoin-cli masternode status'

exec(cliDir, (err, stdout, stderr) => {
    try {
        axios.post(appUrl, {
            status: JSON.parse(stdout.toString()).status + stderr.toString()
        }).then((res) => {
            writeToLogs(res.data)
            process.exit()
        }).catch(res => {
            writeToLogs(res.data)
            process.exit()
        })
    } catch (e) {
        axios.post(appUrl, {
            status: 'ERROR: Incorrect config. Check your MN Key.'
        }).then((res) => {
            writeToLogs(res.data)
            process.exit()
        }).catch(res => {
            writeToLogs(res.data)
            process.exit()
        })
    }
})
