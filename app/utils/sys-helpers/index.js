// @flow
const { waterfall } = require('async')
const transactionParse = require('./transaction-parse')
const isSegwit = require('./is-segwit')
const { flatten } =  require('lodash')

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
  amount: string
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

  if (typeof balance !== 'number') {
    return balance.result
  }

  return balance
}

// Get current addresses
const getAddresses = () => new Promise(async (resolve, reject) => {
  let addresses
  
  try {
    addresses = await syscoin.callRpc('listaddressgroupings', [])
    addresses = flatten(addresses)
  } catch(err) {
    return reject(err)
  }

  addresses = addresses.map(i => ({
    address: i[0],
    balance: i[1],
    label: i[2] || '',
    avatarUrl: ''
  }))

  return resolve(addresses)
})

// Get assets
const getAssets = () => syscoin.callRpc('listassets', [])

// Get asset info
const getAssetInfo = (asset: string) => syscoin.callRpc('assetinfo', [asset])

// Get asset allocation info
const getAssetAllocationInfo = (obj: AllocationInfoType) => syscoin.walletServices.assetAllocation.info(obj.assetId, obj.aliasName, false)

const sendAsset = (obj: SendAssetType) => new Promise(async (resolve, reject) => {
  // Sends asset to specific alias
  const { fromAlias, toAlias, assetId, amount } = obj
  let assetSend
  let signTransaction
  
  try {
    assetSend = await syscoin.callRpc('assetallocationsend', [Number(assetId), fromAlias, toAlias, amount])
  } catch(err) {
    return reject(err)
  }

  try {
    signTransaction = await syscoin.callRpc('signrawtransactionwithwallet', [assetSend.hex])
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

const sendSysTransaction = (obj: sendSysTransactionType) => {
  // Send SYS to address
  const { address, amount, comment = '' } = obj
  return syscoin.callRpc("sendtoaddress", [address, Number(amount), comment])
}

const createNewAsset = async (obj: Object) => {
  const { aliasName, assetName, contract = '', burnMethodSignature = '', precision = 8, supply = 1000, maxSupply = 10000, updateFlags = 1, witness = ''} = obj

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
const getTransactionsPerAsset = ({ address, asset, page = 0 }) => new Promise(async (resolve, reject) => {
  let allocations

  try {
    allocations = await syscoin.callRpc('listassetindex', [page, {
      asset_guid: Number(asset),
      address
    }])
    allocations = allocations.map(i => {
      const allocation = {...i}
      allocation.random = Math.random()
      return allocation
    })
  } catch(err) {
    return reject(err)
  }

  return resolve(allocations)
})

// Get Blockchain status
const getBlockchainInfo = () => syscoin.blockchainServices.getBlockchainInfo()

// Get filtered asset allocation
const getAllTokenBalances = () => new Promise(async (resolve, reject) => {
  let allocationsByAddress
  const balancesByAssets = []
  
  try {
    allocationsByAddress = await getAddresses()
    allocationsByAddress = allocationsByAddress.filter(i => isSegwit(i.address))
    allocationsByAddress = await Promise.all(
      allocationsByAddress.map(i => getAssetBalancesByAddress(i.address))
    )
  } catch(err) {
    return reject(err)
  }

  allocationsByAddress.forEach(i => {
    i.forEach(x => {
      const assetIndex = balancesByAssets.findIndex(z => z.asset_guid === x.asset_guid)

      if (assetIndex !== -1) {
        balancesByAssets[assetIndex].balance = (Number(balancesByAssets[assetIndex].balance) + Number(x.balance)).toString()
        balancesByAssets[assetIndex].balance_zdag = (Number(balancesByAssets[assetIndex].balance_zdag) + Number(x.balance_zdag)).toString()
      } else {
        balancesByAssets.push(x)
      }
    })
  })

  return resolve(balancesByAssets)
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
const listSysTransactions = (page: number = 0, pageSize: number = 10) => new Promise(async (resolve, reject) => {
  let results
  
  try {
    results = await syscoin.callRpc('listtransactions', ['*', pageSize, pageSize * page])
  } catch(err) {
    return reject(err)
  }

  const data = results.map(i => {
    const obj = { ...i }
    obj.time = (new Date(0)).setUTCSeconds(i.time)

    return transactionParse(obj)
  })

  return resolve(data)
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
  let allocations

  try {
    allocations = await syscoin.callRpc('listassetindexallocations', [address])
    allocations = await Promise.all(
      allocations.map(async i => {
        const asset = {...i}

        asset.publicvalue = (await getAssetInfo(i.asset_guid.toString())).publicvalue

        return asset
      })
    )
  } catch(err) {
    return reject(err)
  }

  return resolve(allocations)
})

module.exports = {
  callRpc: syscoin.callRpc,
  aliasInfo,
  currentSysAddress,
  currentBalance,
  editAlias,
  getAllTokenBalances,
  getAddresses,
  getAssetInfo,
  getAssetAllocationInfo,
  getAssetBalancesByAddress,
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
