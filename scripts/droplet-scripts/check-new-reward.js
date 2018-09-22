const localStorage = new require('node-localstorage').LocalStorage('./storage')
const axios = require('axios')
const { execSync } = require('child_process')

const getMnDataUrl = 'https://us-central1-mm-dev-v2.cloudfunctions.net/app/droplets/get-mn-data'
const sendRewardNotif = 'https://us-central1-mm-dev-v2.cloudfunctions.net/app/droplets/reward-notification'

axios.get(getMnDataUrl).then(res => {
    const { mnRewardAddress } = res.data
    const lastTime = parseInt(localStorage.getItem('transactionCount')) || 0

    let transactions, newOnes, hasReward

    // Get latest transactions
    transactions = JSON.parse(execSync(`~/syscoin/src/syscoin-cli getaddressdeltas '{"addresses": ["${mnRewardAddress}"]}'`).toString())

    if (transactions.length !== lastTime) {
        // If new transactions since the last time the script ran, check if its a reward
        newOnes = transactions.slice(lastTime)
        hasReward = newOnes.find(i => i.satoshis === 2598750000)

        if (hasReward) {
            // If there is a new reward, send a notification
            axios.post(sendRewardNotif).then((res) => {
                // Saves transaction number in localStorage
                localStorage.setItem('transactionCount', transactions.length)

                process.exit()
            }).catch((err) => {
                process.exit()
            })
        } else {
            process.exit()
        }
    } else {
        process.exit()
    }
}).catch(() => process.exit())