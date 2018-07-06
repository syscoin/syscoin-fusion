const axios = require('axios')
const { exec } = require('child_process')
const writeToLogs = require('./write-log')

const appUrl = 'https://us-central1-mm-dev-v2.cloudfunctions.net/app/droplets/edit-status'
const cliDir = '~/syscoin/src/syscoin-cli masternode status'

const formatter = (obj) => `${(new Date()).toString()}: Message: ${obj.message} | Error: ${obj.error}\n`

module.exports = () => {
    exec(cliDir, (err, stdout, stderr) => {
        axios.post(appUrl, {
            body: {
                status: stdout + stderr
            }
        }).then(res => writeToLogs(formatter(res.response.data))).catch(res => writeToLogs(formatter(res.response.data)))
    })
}
