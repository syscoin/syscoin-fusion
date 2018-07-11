const axios = require('axios')
const { exec } = require('child_process')
const writeToLogs = require('./write-log')

const appUrl = 'https://us-central1-mm-dev-v2.cloudfunctions.net/app/droplets/edit-status'
const cliDir = '~/syscoin/src/syscoin-cli masternode status'

const formatter = (obj) => `${(new Date()).toString()}: Message: ${obj.message} | Error: ${obj.error}\n`

exec(cliDir, (err, stdout, stderr) => {
    axios.post(appUrl, {
        status: JSON.parse(stdout.toString()).status + stderr.toString()
    }).then((res) => {
        writeToLogs(formatter(res.data))
        process.exit()
    }).catch(res => {
        writeToLogs(formatter(res.data))
        process.exit()
    })
})
