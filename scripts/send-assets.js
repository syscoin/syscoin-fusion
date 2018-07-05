require('dotenv').config()

const exec = require('child_process').execSync

const { SYS_LOCATION, DATA_DIR } = process.env

/* SCRIPT PARAMS */

const fromAliasName = process.argv.slice(2)[0].toString()
const toAliasName = process.argv.slice(2)[1].toString()
const assetName = process.argv.slice(2)[2].toString()
const assetAmount = process.argv.slice(2)[3].toString(0)

if (!fromAliasName || !assetName || !toAliasName || !assetAmount) {
    throw new Error('No alias/asset/amount provided')
}

/* FUNCTIONS */

const assetAllocationSend = () => JSON.parse(exec(`"${SYS_LOCATION}" -datadir="${DATA_DIR}" assetallocationsend ${assetName} ${fromAliasName} [{\\"aliasto\\":\\"${toAliasName}\\",\\"amount\\":${assetAmount}}] "" ""`).toString())[0]

const assetAllocationInfo = (assetUid, aliasName) => JSON.parse(exec(`"${SYS_LOCATION}" -datadir="${DATA_DIR}" assetallocationinfo ${assetUid} ${aliasName} false`).toString())

const signRawTransaction = txfund => JSON.parse(exec(`"${SYS_LOCATION}" -datadir="${DATA_DIR}" signrawtransaction ${txfund}`).toString()).hex

const sendRawTransaction = raw => JSON.parse(exec(`"${SYS_LOCATION}" -datadir="${DATA_DIR}" syscoinsendrawtransaction ${raw}`).toString()).txid

const generateOne = () => {
    exec(`"${SYS_LOCATION}" -datadir="${DATA_DIR}" generate 1`)
}

const getAliasInfo = () => JSON.parse(exec(`"${SYS_LOCATION}" -datadir="${DATA_DIR}" aliasinfo ${aliasName}`).toString())


// Process

const allocationSendCode = assetAllocationSend()
const signRaw = signRawTransaction(allocationSendCode)
sendRawTransaction(signRaw)

console.log(assetAllocationInfo(assetName, fromAliasName))
console.log(assetAllocationInfo(assetName, toAliasName))
