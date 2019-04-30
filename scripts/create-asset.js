require('dotenv').config()

const exec = require('child_process').execSync

const { SYS_LOCATION, DATA_DIR } = process.env

/* SCRIPT PARAMS */

const aliasName = process.argv.slice(2)[0].toString()
const assetName = process.argv.slice(2)[1].toString()

if (!aliasName || !assetName) {
    throw new Error('No alias/asset name provided')
}

/* FUNCTIONS */

const assetNew = () => JSON.parse(exec(`"${SYS_LOCATION}" -datadir="${DATA_DIR}" assetnew ${assetName} ${aliasName} "public_info" assets 8 false 100 5000000 0 false ""`).toString())

const assetSend = (assetUid) => JSON.parse(exec(`"${SYS_LOCATION}" -datadir="${DATA_DIR}" assetsend ${assetUid} ${aliasName} [{\\"ownerto\\":\\"${aliasName}\\",\\"amount\\":100}] "memo" ""`).toString())[0]

const assetAllocation = (assetUid) => JSON.parse(exec(`"${SYS_LOCATION}" -datadir="${DATA_DIR}" assetallocationinfo ${assetUid} ${aliasName} false`).toString())

const signRawTransaction = txfund => JSON.parse(exec(`"${SYS_LOCATION}" -datadir="${DATA_DIR}" signrawtransaction ${txfund}`).toString()).hex

const sendRawTransaction = raw => JSON.parse(exec(`"${SYS_LOCATION}" -datadir="${DATA_DIR}" syscoinsendrawtransaction ${raw}`).toString()).txid

const generateOne = () => {
    exec(`"${SYS_LOCATION}" -datadir="${DATA_DIR}" generate 101`)
}

const getAliasInfo = () => JSON.parse(exec(`"${SYS_LOCATION}" -datadir="${DATA_DIR}" aliasinfo ${aliasName}`).toString())


// Process

const assetUid = assetNew()
let signRaw = signRawTransaction(assetUid[0])
sendRawTransaction(signRaw)

generateOne()

const assetSendId = assetSend(assetUid[1])
signRaw = signRawTransaction(assetSendId)
sendRawTransaction(signRaw)

generateOne()

console.log(assetAllocation(assetUid[1]))

process.exit()
