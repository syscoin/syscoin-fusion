require('dotenv').config();

const exec = require('child_process').execSync
const { SYS_LOCATION } = process.env

/* SCRIPT PARAMS */

const aliasName = process.argv.slice(2)[0].toString()

if (!aliasName) {
    throw new Error('No alias name provided')
}

/* FUNCTIONS */
const createNewAlias = () => {
    return eval((exec(`"${SYS_LOCATION}" aliasnew ${aliasName} "" 3 1548184538 "" "" "" ""`).toString()))[0]
}

const txFund = alias => {
    return eval((exec(`"${SYS_LOCATION}" syscointxfund ${alias}`).toString()))[0]
}

const signRawTransaction = txfund => {
    return JSON.parse(exec(`"${SYS_LOCATION}" signrawtransaction ${txfund}`).toString()).hex
}

const sendRawTransaction = raw => {
    return JSON.parse(exec(`"${SYS_LOCATION}" syscoinsendrawtransaction ${raw}`).toString()).txid
}

const generateOne = () => {
    exec(`"${SYS_LOCATION}" generate 1`)
}

const getAliasInfo = () => {
    return JSON.parse(exec(`"${SYS_LOCATION}" aliasinfo ${aliasName}`).toString())
}

// First round

const aliasOne = createNewAlias()
const txFundOne = txFund(aliasOne)
const signRawTransactionOne = signRawTransaction(txFundOne)
const sendRawTransactionOne = sendRawTransaction(signRawTransactionOne)

generateOne()

// Second round
const aliasTwo = createNewAlias()
const txFundTwo = txFund(aliasTwo)
const signRawTransactionTwo = signRawTransaction(txFundTwo)
const sendRawTransactionTwo = sendRawTransaction(signRawTransactionTwo)

generateOne()

console.log(getAliasInfo())

process.exit()