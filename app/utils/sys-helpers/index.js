// @flow
const { waterfall } = require('async')
const { uniqBy } = require('lodash')

const Syscoin = require('syscoin-js').SyscoinRpcClient

const syscoin = new Syscoin({port: 8369, username: 'u', password: 'p'})

window.sys = syscoin

/*
  SYS Helpers. All calls returns a Promise.
*/

type AllocationInfoType = {
  assetId: string,
  aliasName: string
};
type SendAssetType = {
  fromAlias: string,
  toAlias: string,
  assetId: string,
  amount: string,
  comment?: string
};
type sendSysTransactionType = {
  address: string,
  amount: string,
  comment?: string
};

type listAssetAllocationType = {
  alias?: string,
  receiver_address?: Array<string> | string,
  txid?: string,
  asset?: string,
  receiver_alias?: Array<string> | string,
  startblock?: number
};

// Get network info
// const getInfo = () => syscoin.networkServices.getInfo()
// const getInfo = () => syscoin.callRpc('getinfo', [])

// Get current SYS address
const currentSysAddress = (address?: string = '') => syscoin.walletServices.getAccountAddress(address)

// Get current SYS Balance
const currentBalance = async () => {
  let balance
  try {
    balance = await syscoin.callRpc('getbalance', [])
  } catch(err) {
    return err
  }

  if (balance.result) {
    return balance.result
  }

  return balance
}

// Get current aliases
const getAliases = () => new Promise(async (resolve, reject) => {
  let aliases
  
  try {
    aliases = await syscoin.walletServices.syscoinListReceivedByAddress()
  } catch(err) {
    return reject(err)
  }

  aliases = aliases.filter(i => i.address)

  return resolve(aliases)
})

// Get assets
const getAssets = () => syscoin.callRpc('listassets', [])

// Get asset info
const getAssetInfo = (asset: string) => syscoin.walletServices.asset.info({
  asset,
  getInputs: false
})

// Get asset allocation info
const getAssetAllocationInfo = (obj: AllocationInfoType) => syscoin.walletServices.assetAllocation.info(obj.assetId, obj.aliasName, false)

const sendAsset = (obj: SendAssetType) => new Promise(async (resolve, reject) => {
  // Sends asset to specific alias
  const { fromAlias, toAlias, assetId, amount } = obj
  let assetSend
  let txFund
  let signTransaction
  
  try {
    assetSend = await syscoin.callRpc('assetsend', [Number(assetId), [{ address: toAlias, amount: Number(amount) }], ''])
  } catch(err) {
    return reject(err)
  }

  try {
    txFund = await syscoin.callRpc('syscointxfund', [assetSend[0], fromAlias])
  } catch(err) {
    return reject(err)
  }

  try {
    signTransaction = await syscoin.callRpc('signrawtransactionwithwallet', [txFund[0]])
  } catch(err) {
    return reject(err)
  }

  try {
    await syscoin.callRpc('sendrawtransaction', [signTransaction.hex])
  } catch(err) {
    return reject(err)
  }

  return resolve(true)
})

// const sendAsset = async (obj: SendAssetType) => {
//   // Sends asset to specific alias
//   const { fromAlias, toAlias, assetId, amount, comment } = obj
//   let response
//   return await syscoin.callRpc('assetallocationsend', [assetId, fromAlias, [{ ownerto: toAlias, amount: parseFloat(amount) }], comment, ''])
  
// }
// const sendSysTransaction = (obj: sendSysTransactionType) => {
//   // Send SYS to address
//   const { address, amount, comment = '' } = obj
//   return syscoin.walletServices.sendToAddress(address, Number(amount), comment)
// }

const sendSysTransaction = (obj: sendSysTransactionType) => {
  // Send SYS to address
  const { address, amount, comment = '' } = obj
  return syscoin.callRpc("sendtoaddress", [address, Number(amount), comment])
}

const createNewAsset = async (obj: Object) => {
  const { aliasName, assetName, contract = '', burnMethodSignature = '', precision = 8, supply = 1000, maxSupply = 10000, updateFlags = 1, witness = ""} = obj

  let asset, txFund, signRaw

  try {
    asset = await assetNew(obj)
    txFund = await syscoinTxFund(asset[0], aliasName)
    signRaw = await signRawTransaction(txFund[0])
    await sendRawTransaction(signRaw.hex)
  } catch(error) {
    return error
  }

  return asset
}

const assetNew = (obj: Object) => {
  const { aliasName, assetName, contract = '', burnMethodSignature = '', precision = 8, supply = 1000, maxSupply = 10000, updateFlags = 1, witness = ""} = obj
  return syscoin.callRpc('assetnew', [aliasName, assetName, contract, burnMethodSignature, precision, supply, maxSupply, updateFlags, witness])
}

const syscoinTxFund = (tx, aliasName) => {
  return syscoin.callRpc('syscointxfund', [tx, aliasName])
}

const signRawTransaction = (txFund) => {
  return syscoin.callRpc('signrawtransactionwithwallet', [txFund])
}

const sendRawTransaction = (raw) => {
  return syscoin.callRpc('sendrawtransaction', [raw])
}


const createNewAlias = (obj: Object) => new Promise((resolve, reject) => {
  // Creates new alias
  const { aliasName, publicValue = '', acceptTransferFlags = 3, expireTimestamp = 1548184538, address = '', encryptionPrivKey = '', encryptionPublicKey = '', witness = '' } = obj
  waterfall([
    done => {
      syscoin.walletServices.alias.new({
        aliasName,
        publicValue,
        acceptTransferFlags,
        expireTimestamp: parseInt(expireTimestamp, 10),
        address,
        encryptionPrivateKey: encryptionPrivKey,
        encryptionPublicKey,
        witness
      }).then(result => done(null, result[0]))
        .catch(err => done(err))
    },
    (firstResult, done) => {
      syscoin.walletServices.syscoinTxFund(firstResult)
        .then(result => done(null, result[0]))
        .catch(err => done(err))
    },
    (syscoinTxResult, done) => {
      syscoin.transactionServices.signRawTransaction({ hexString: syscoinTxResult })
        .then(resultSign => done(null, resultSign.hex))
        .catch(err => done(err))
    },
    (signOutput, done) => {
      syscoin.walletServices.syscoinSendRawTransaction(signOutput)
        .then(resultSend => done(null, resultSend))
        .catch(err => done(err))
    }
  ], (err, result) => {
    if (err) {
      return reject(err)
    }

    return resolve(result)
  })
})

// Backup wallet
const exportWallet = (backupDir: string) => syscoin.callRpc('dumpwallet', [backupDir])

// Imports wallet backup
const importWallet = (backupDir: string) => syscoin.callRpc('importwallet', [backupDir])

// Returns priv key of desired address.
const getPrivateKey = (address: string) => syscoin.callRpc('dumpprivkey', [address])

// Edit existing alias
const editAlias = (obj: Object) => new Promise((resolve, reject) => {
  const { aliasName, publicValue = '', acceptTransferFlags = 3, expireTimestamp = 1548184538, address = '', encPrivKey = '', encPubKey = '', witness = '' } = obj
  waterfall([
    done => {
      syscoin.walletServices.alias.update({
        aliasName,
        publicValue,
        acceptTransferFlags,
        expireTimestamp: parseInt(expireTimestamp, 10),
        address,
        encryptionPrivateKey: encPrivKey,
        encryptionPublicKey: encPubKey,
        witness
      }).then(result => done(null, result[0]))
        .catch(err => done(err))
    },
    (updateResult, done) => {
      syscoin.transactionServices.signRawTransaction({ hexString: updateResult })
        .then(resultSign => done(null, resultSign.hex))
        .catch(err => done(err))
    },
    (signOutput, done) => {
      syscoin.walletServices.syscoinSendRawTransaction(signOutput)
        .then(resultSend => done(null, resultSend))
        .catch(err => done(err))
    }
  ], (err) => {
    if (err) {
      return reject(err)
    }

    return resolve()
  })
})

// Get info from alias
const aliasInfo = (name: string) => syscoin.walletServices.alias.info({ aliasName: name })

// Generates transaction history per specific asset and address
const getTransactionsPerAsset = ({ address, asset }) => new Promise(async (resolve, reject) => {
  let allocations

  try {
    allocations = await syscoin.callRpc('listassetindex', [0, {
      asset: Number(asset),
      addresses: [{ address }]
    }])
  } catch(err) {
    return reject(err)
  }
  allocations = allocations.filter(i => i.txtype === 'assetsend')
  allocations = uniqBy(allocations, 'txid')

  console.log(allocations)

  return resolve(allocations)
})

// Get Blockchain status
const getBlockchainInfo = () => syscoin.blockchainServices.getBlockchainInfo()

// Get filtered asset allocation
const listAssetAllocation = (obj: listAssetAllocationType, filterGuids?: Array<string>) => new Promise((resolve, reject) => {
  syscoin.callRpc('listassetallocations', [999999, 0, obj])
    .then(result => {
      let data = result

      if (Array.isArray(filterGuids) && filterGuids.length) {
        data = data.filter(i => filterGuids.indexOf(i.asset) !== -1)
      }
      return resolve(data)
    })
    .catch(err => reject(err))
})

const listAssetAllocationTransactions = (obj: listAssetAllocationType, filterGuids?: Array<string>) => new Promise((resolve, reject) => {
  syscoin.callRpc('listassetallocationtransactions', [999999, 0, obj])
    .then(result => {
      let data = result

      if (Array.isArray(filterGuids) && filterGuids.length) {
        data = data.filter(i => filterGuids.indexOf(i.asset) !== -1)
      }

      return resolve(data)
    })
    .catch(err => reject(err))
})

// Get list of SYS transactions in the wallet
const listSysTransactions = (page: number = 0, pageSize: number = 10) => new Promise((resolve, reject) => {
  syscoin.walletServices.listTransactions(pageSize, pageSize * page)
    .then(results => {
      let data = results.map(i => {
        const obj = { ...i }
        obj.time = (new Date(0)).setUTCSeconds(i.time)
        return obj
      })

      data = uniqBy(data, 'txid')

      return resolve(data)
    })
    .catch(err => reject(err))
})

const encryptWallet = (pass: string) => {
  return syscoin.callRpc('encryptwallet', [pass])
}
const unlockWallet = (pass: string, time: number) => syscoin.callRpc('walletpassphrase', [pass, time])
const changePwd = (oldPwd: string, newPwd: string) => syscoin.callRpc('walletpassphrasechange', [oldPwd, newPwd])
const lockWallet = () => syscoin.callRpc('walletlock')

const isEncrypted = () => new Promise((resolve) => {
  syscoin.callRpc('walletpassphrase')
    .then(() => resolve(true))
    .catch(err => resolve(err.code === -1))
})

const claimAssetInterest = (asset: string, alias: string) => new Promise((resolve, reject) => {
  waterfall([
    done => syscoin.callRpc('assetallocationcollectinterest', [asset, alias, '']).then(hex => done(null, hex[0])).catch(err => done(err)),
    (interestOutput, done) => syscoin.transactionServices.signRawTransaction({ hexString: interestOutput }).then(res => done(null, res.hex)).catch(err => done(err)),
    (signOutput, done) => syscoin.walletServices.syscoinSendRawTransaction(signOutput).then(() => done()).catch(err => done(err))
  ], err => {
    if (err) {
      return reject(err)
    }

    return resolve()
  })
})

const getBlockHash = (blockNumber: number) => syscoin.callRpc('getblockhash', [blockNumber])
const getBlock = (hash: string) => syscoin.callRpc('getblock', [hash])

const getBlockByNumber = (blockNumber: number) => new Promise(async (resolve, reject) => {
  let blockHash
  let block

  try {
    blockHash = await getBlockHash(blockNumber)
  } catch (err) {
    return reject(err)
  }

  try {
    block = await getBlock(blockHash)
  } catch (err) {
    return reject(err)
  }

  return resolve(block)
})

const getAssetBalancesByAddress = address => new Promise(async (resolve, reject) => {
  let associatedAssets
  let allocationsInfo

  try {
    associatedAssets = await syscoin.callRpc('listassetindexassets', [address])
  } catch(err) {
    return reject(err)
  }

  associatedAssets = associatedAssets.map(i => i.asset)
  
  try {
    allocationsInfo = await Promise.all(
      associatedAssets.map(i => syscoin.callRpc('assetallocationinfo', [i, address]))
    )
  } catch(err) {
    return reject(err)
  }

  try {
    allocationsInfo = await Promise.all(
      allocationsInfo.map(async i => {
        // eslint-disable-next-line no-param-reassign
        i.assetinfo = await syscoin.callRpc('assetinfo', [i.asset])
        return i
      })
    )
  } catch(err) {
    return reject(err)
  }

  return resolve(allocationsInfo)
})

module.exports = {
  callRpc: syscoin.callRpc,
  aliasInfo,
  currentSysAddress,
  currentBalance,
  editAlias,
  getAliases,
  getAssetInfo,
  getAssetAllocationInfo,
  getAssetBalancesByAddress,
  listAssetAllocation,
  listAssetAllocationTransactions,
  sendAsset,
  sendSysTransaction,
  createNewAlias,
  exportWallet,
  importWallet,
  getPrivateKey,
  getTransactionsPerAsset,
  getBlockchainInfo,
  listSysTransactions,
  encryptWallet,
  unlockWallet,
  changePwd,
  lockWallet,
  isEncrypted,
  claimAssetInterest,
  getBlockByNumber,
  getAssets
}
