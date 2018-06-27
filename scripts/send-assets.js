require('dotenv').config()

const exec = require('child_process').execSync
const { SYS_LOCATION } = process.env

/* SCRIPT PARAMS */

const fromAliasName = process.argv.slice(2)[0].toString()
const toAliasName = process.argv.slice(2)[1].toString()
const assetName = process.argv.slice(2)[2].toString()
const assetAmount = process.argv.slice(2)[3].toString(0)

if (!fromAliasName || !assetName || !toAliasName || !assetAmount) {
    throw new Error('No alias/asset/amount provided')
}

/* FUNCTIONS */

const assetAllocationSend = () => {
    return JSON.parse(exec(`"${SYS_LOCATION}" assetallocationsend ${assetName} ${fromAliasName} [{\\"aliasto\\":\\"${toAliasName}\\",\\"amount\\":${assetAmount}}] "" ""`).toString())[0]
}

const assetAllocationInfo = (assetUid, aliasName) => {
    return JSON.parse(exec(`"${SYS_LOCATION}" assetallocationinfo ${assetUid} ${aliasName} false`).toString())
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


// Process

const allocationSendCode = assetAllocationSend()
let signRaw = signRawTransaction(allocationSendCode)
sendRawTransaction(signRaw)

console.log(assetAllocationInfo(assetName, fromAliasName))
console.log(assetAllocationInfo(assetName, toAliasName))
