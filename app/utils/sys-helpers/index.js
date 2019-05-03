// @flow
const { waterfall, parallel } = require('async')
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

type getTransactionsPerAssetType = {
  assetId: string,
  alias: string
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
const getInfo = () => syscoin.callRpc('getinfo', [])

// Get current SYS address
const currentSysAddress = (address?: string = '') => syscoin.walletServices.getAccountAddress(address)

// Get current SYS Balance
const currentBalance = () => syscoin.callRpc('getbalance', [])

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

const sendAsset = (obj: SendAssetType) => new Promise((resolve, reject) => {
  // Sends asset to specific alias
  const { fromAlias, toAlias, assetId, amount, comment } = obj
  waterfall([
    done => {
      syscoin.callRpc('assetallocationsend', [assetId, fromAlias, [{ ownerto: toAlias, amount: parseFloat(amount) }], comment, ''])
        .then(result => done(null, result[0]))
        .catch(err => {
          if (err.message.indexOf('ERRCODE: 1018') !== -1) {
            return done(null, null)
          }

          return done(err)
        })
    },
    (firstOutput, done) => {
      if (!firstOutput) {
        return syscoin.callRpc('assetallocationsend', [assetId, fromAlias, [{ ownerto: toAlias, ranges: [{ start: 0, end: parseFloat(amount) }] }], comment, ''])
          .then(stringTwo => done(null, stringTwo[0]))
          .catch(err => done(err))
      }

      done(null, firstOutput)
    },
    (assetAllocationOutput, done) => {
      syscoin.transactionServices.signRawTransaction({ hexString: assetAllocationOutput })
        .then(resultSign => done(null, resultSign.hex))
        .catch(err => done(err))
    },
    (signOutput, done) => {
      syscoin.callRpc('syscoinsendrawtransaction', [signOutput])
        .then(resultSend => done(null, resultSend))
        .catch(err => done(err))
    }
  ], (err) => {
    if (err) {
      return reject(err)
    }

    resolve()
  })
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

// Generates transaction history per specific asset and alias
const getTransactionsPerAsset = (obj: getTransactionsPerAssetType) => new Promise((resolve, reject) => {
  parallel([
    (done) => {
      syscoin.callRpc('listassetallocationtransactions', [
        999999,
        0,
        {
          /*senders: [
            {
              [obj.isAlias ? 'sender_alias' : 'sender_address']: obj.alias
            }
          ],*/
          [obj.isAlias ? 'sender_alias' : 'sender_address']: obj.alias,
          asset: obj.assetId
        }
      ]).then(results => done(null, results))
        .catch(err => {
          done(err)
        })
    },
    (done) => {
      syscoin.callRpc('listassetallocationtransactions', [
        999999,
        0,
        {
            /*receivers: [
              {
                [obj.isAlias ? 'receiver_alias' : 'receiver_address']: obj.alias,
              }
            ],*/
            [obj.isAlias ? 'receiver_alias' : 'receiver_address']: obj.alias,
            asset: obj.assetId
        }
      ])
        .then(results => done(null, results))
        .catch(err => done(err))
    }
  ], (err, tasks) => {
    if (err) {
      return reject(err)
    }
    let data = tasks[0].concat(tasks[1])

    const txids = data.map(i => i.txid)

    // remove duplicates
    data = data.filter((i, ind) => txids.indexOf(i.txid) === ind)
    // temporal workaround for transactions from other aliases in output
    data = data.filter(i => !(i.receiver !== obj.alias && i.sender !== obj.alias))

    // Parse JSON and filter out transactions that dont include selected alias.
    data = data.map(i => {
        const asset = { ...i }
        asset.amount = asset.amount[0] === '-' ? asset.amount.slice(1) : asset.amount
        asset.time = (new Date(0)).setUTCSeconds(asset.time)
        return asset
      })

    return resolve(data)
  })
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

module.exports = {
  callRpc: syscoin.callRpc,
  aliasInfo,
  currentSysAddress,
  currentBalance,
  editAlias,
  getAliases,
  getAssetInfo,
  getAssetAllocationInfo,
  getInfo,
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
