const axios = require('axios')
const { exec } = require('child_process')
const writeToLogs = require('./write-log')
const config = require('./config')
const chainConfig = require('/root/chain-config')
const appUrl = config.appUrl + '/droplets/edit-status'

if(!chainConfig.nodeStatus) {throw new Error('unable to get node status command')}
const cliDir = `chain-cli ${chainConfig.nodeStatus()}`;


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
            status: 'ERROR: Incorrect config. Please check your MN Key.'
        }).then((res) => {
            writeToLogs(res.data)
            process.exit()
        }).catch(res => {
            writeToLogs(res.data)
            process.exit()
        })
    }
})
