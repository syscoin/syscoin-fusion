// @flow
const { waterfall, parallel } = require('async')

const Syscoin = require('fw/syscoin-js')

const syscoin = new Syscoin()
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
  amount: number,
  comment?: string
};

type getTransactionsPerAssetType = {
  assetId: string,
  alias: string
};

type listAssetAllocationType = {
  receiver_address?: string,
  txid?: string,
  asset?: string,
  receiver_alias?: string,
  startblock?: number
};

// Get network info
const getInfo = () => syscoin.networkServices.getInfo()

// Get current SYS address
const currentSysAddress = (address?: string = '') => syscoin.walletServices.getAccountAddress(address)

// Get current SYS Balance
const currentBalance = () => syscoin.callRpc('getbalance')

// Get current aliases
const getAliases = () => syscoin.walletServices.syscoinListReceivedByAddress()

// Get asset info
const getAssetInfo = (assetId: string) => syscoin.walletServices.asset.info(assetId, false)

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
            return done(null)
          }

          return done(err)
        })
    },
    (firstOutput, done) => {
      if (!firstOutput) {
        return syscoin.callRpc('assetallocationsend', [assetId, fromAlias, [{ ownerto: toAlias, ranges: { start: 0, end: parseFloat(amount) } }], comment, ''])
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
      syscoin.walletServices.syscoinSendRawTransaction(signOutput)
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

const sendSysTransaction = (obj: sendSysTransactionType) => {
  // Send SYS to address
  const { address, amount, comment = '' } = obj
  return syscoin.walletServices.sendToAddress(address, amount, comment)
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
      console.log(err)
      return reject(err)
    }

    return resolve(result)
  })
})

// Backup wallet
const exportWallet = (backupDir: string) => syscoin.walletServices.dumpWallet(backupDir)

// Imports wallet backup
const importWallet = (backupDir: string) => syscoin.walletServices.importWallet(backupDir)

// Returns priv key of desired address.
const getPrivateKey = (address) => syscoin.walletServices.dumpPrivKey(address)

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
      console.log(err)
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
      syscoin.walletServices.assetAllocation.listTransactions({ count: 999999, from: 0, options: { sender_address: obj.alias, asset: obj.assetId } })
        .then(results => done(null, results))
        .catch(err => done(err))
    },
    (done) => {
      syscoin.walletServices.assetAllocation.listTransactions({ count: 999999, from: 0, options: { receiver_address: obj.alias, asset: obj.assetId } })
        .then(results => done(null, results))
        .catch(err => done(err))
    }
  ], (err, tasks) => {
    if (err) {
      return reject(err)
    }

    // Parse JSON and filter out transactions that dont include selected alias. Then remove any undesired stuff from response
    let data = tasks[0].concat(tasks[1])
      .map(i => {
        const asset = { ...i }
        asset.amount = asset.amount[0] === '-' ? asset.amount.slice(1) : asset.amount
        asset.time = (new Date(0)).setUTCSeconds(asset.time)
        return asset
      })

    const txids = data.map(i => i.txid)

    data = data.filter((i, ind) => txids.indexOf(i.txid) === ind)

    return resolve(data)
  })
})

// Get Blockchain status
const getBlockchainInfo = () => syscoin.blockchainServices.getBlockchainInfo()

// Get filtered asset allocation
const listAssetAllocation = (obj: listAssetAllocationType, filterGuids?: Array<string>) => new Promise((resolve, reject) => {
  syscoin.walletServices.assetAllocation.list({ count: 999999, from: 0, options: obj })
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
  syscoin.walletServices.listTransactions(pageSize, page * pageSize)
    .then(results => {
      const data = results.map(i => {
        const obj = { ...i }
        obj.time = (new Date(0)).setUTCSeconds(i.time)
        return obj
      })

      return resolve(data)
    })
    .catch(err => reject(err))
})

const encryptWallet = (pass: string) => syscoin.callRpc('encryptwallet', [pass])


const isEncrypted = () => new Promise((resolve, reject) => {
  syscoin.callRpc('walletpassphrase')
    .then(() => resolve())
    .catch(() => reject())
})

module.exports = {
  aliasInfo,
  currentSysAddress,
  currentBalance,
  editAlias,
  getAliases,
  getAssetInfo,
  getAssetAllocationInfo,
  getInfo,
  listAssetAllocation,
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
  isEncrypted
}
