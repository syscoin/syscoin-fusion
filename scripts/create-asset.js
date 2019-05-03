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

const assetNew = () => JSON.parse(exec(`"${SYS_LOCATION}" -datadir="${DATA_DIR}" -rpcport=8369 -rpcuser=u -rpcpassword=p assetnew ${aliasName} "${assetName}" "" "" 8 1000 10000 1 ""`).toString())

const assetSend = (assetUid) => JSON.parse(exec(`"${SYS_LOCATION}" -datadir="${DATA_DIR}" -rpcport=8369 -rpcuser=u -rpcpassword=p assetsend ${assetUid} ${aliasName} [{\\"ownerto\\":\\"${aliasName}\\",\\"amount\\":100}] "memo" ""`).toString())[0]

const assetAllocation = (assetUid) => JSON.parse(exec(`"${SYS_LOCATION}" -datadir="${DATA_DIR}" -rpcport=8369 -rpcuser=u -rpcpassword=p assetallocationinfo ${assetUid} ${aliasName} false`).toString())

const signRawTransaction = txfund => JSON.parse(exec(`"${SYS_LOCATION}" -datadir="${DATA_DIR}" -rpcport=8369 -rpcuser=u -rpcpassword=p signrawtransactionwithwallet ${txfund}`).toString()).hex

const sendRawTransaction = raw => exec(`"${SYS_LOCATION}" -datadir="${DATA_DIR}" -rpcport=8369 -rpcuser=u -rpcpassword=p sendrawtransaction ${raw}`)

const generateOne = () => {
    exec(`"${SYS_LOCATION}" -rpcport=8369 -rpcuser=u -rpcpassword=p -datadir="${DATA_DIR}" generate 101`)
}

const getAliasInfo = () => JSON.parse(exec(`"${SYS_LOCATION}" -rpcport=8369 -rpcuser=u -rpcpassword=p -datadir="${DATA_DIR}" aliasinfo ${aliasName}`).toString())

const syscoinTxFund = (tx) => JSON.parse(exec(`"${SYS_LOCATION}" -rpcport=8369 -rpcuser=u -rpcpassword=p -datadir="${DATA_DIR}" syscointxfund ${tx} ${aliasName}`).toString())[0]


// Process

const assetUid = assetNew()
const txFund = syscoinTxFund(assetUid[0])
let signRaw = signRawTransaction(txFund)
sendRawTransaction(signRaw)

generateOne()

const secAssetGuid = assetNew()
console.log(secAssetGuid)
const sectxFund = syscoinTxFund(secAssetGuid[0])
let secSignRaw = signRawTransaction(sectxFund)
sendRawTransaction(secSignRaw)

generateOne()

process.exit()
