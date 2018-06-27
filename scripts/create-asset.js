require('dotenv').config()

const exec = require('child_process').execSync
const { SYS_LOCATION } = process.env

/* SCRIPT PARAMS */

const aliasName = process.argv.slice(2)[0].toString()
const assetName = process.argv.slice(2)[1].toString()

if (!aliasName || !assetName) {
    throw new Error('No alias/asset name provided')
}

/* FUNCTIONS */

const assetNew = () => {
    return JSON.parse(exec(`"${SYS_LOCATION}" assetnew ${assetName} ${aliasName} "public_info" assets 8 false 1000000 5000000 0 false ""`).toString())
}

const assetSend = (assetUid) => {
    return JSON.parse(exec(`"${SYS_LOCATION}" assetsend ${assetUid} ${aliasName} [{\\"aliasto\\":\\"${aliasName}\\",\\"amount\\":100000}] "memo" ""`).toString())[0]
}

const assetAllocation = (assetUid) => {
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

const assetUid = assetNew()
let signRaw = signRawTransaction(assetUid[0])
sendRawTransaction(signRaw)

generateOne()

let assetSendId = assetSend(assetUid[1])
signRaw = signRawTransaction(assetSendId)
sendRawTransaction(signRaw)

generateOne()

console.log(assetAllocation(assetUid[1]))

process.exit()
