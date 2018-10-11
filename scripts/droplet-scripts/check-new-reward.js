const localStorage = new require('node-localstorage').LocalStorage('./storage')
const axios = require('axios')
const { execSync } = require('child_process')
const config = require('./config')
const chainConfig = require('/root/chain-config')

const getMnDataUrl = config.appUrl + '/droplets/get-mn-data'
const sendRewardNotif = config.appUrl + '/droplets/reward-notification'

axios.get(getMnDataUrl).then(res => {
    const { mnRewardAddress, nodeType } = res.data
    const lastTime = parseInt(localStorage.getItem('transactionCount')) || 0

    let transactions

    // Get latest transactions
    try {
        transactions = JSON.parse(execSync(chainConfig.checkReward(mnRewardAddress)).toString())
        // filter out all the spent outputs;  only consider debited tx
        transactions = transactions.filter(tx => { return tx.satoshis > 0 })
    } catch(err) {
        throw new Error(err)
    }

    if (transactions.length !== lastTime) {
        // If number of transactions is different from the last time it checked, send a notification
        newOne = transactions.slice().pop()

        axios.post(sendRewardNotif, {
            amount: newOne.satoshis / 100000000,
            address: mnRewardAddress,
            type: nodeType
        }).then((res) => {
            // Saves transaction number in localStorage
            localStorage.setItem('transactionCount', transactions.length)

            process.exit()
        }).catch((err) => {
            process.exit()
        })
    } else {
        process.exit()
    }
}).catch(() => process.exit())