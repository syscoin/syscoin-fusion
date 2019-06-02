/* eslint-disable no-param-reassign */
// @flow
const { waterfall } = require('async')
const transactionParse = require('./transaction-parse')
const isSegwit = require('./is-segwit')
const { flatten } =  require('lodash')

const Syscoin = require('syscoin-js').SyscoinRpcClient

const syscoin = new Syscoin({port: 8370, username: 'u', password: 'p', allowCoerce: false})

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


// Get current SYS address
const currentSysAddress = (address?: string = '') => syscoin.walletServices.getAccountAddress(address)

// Get current SYS Balance
const currentBalance = async () => {
  let balance
  try {
    balance = await syscoin.callRpc('getbalance', [])
  } catch(err) {
    return 0
  }

  if (typeof balance !== 'number') {
    return balance.result
  }

  return balance
}

// Get current addresses
const getAddresses = () => new Promise(async (resolve, reject) => {
  let addresses
  let addressesping
  
  try {
    addresses = await syscoin.callRpc('listreceivedbyaddress', [0, true])
    addressesping = flatten(await syscoin.callRpc('listaddressgroupings', []))
  } catch(err) {
    return reject(err)
  }

  addresses = addresses.map(i => ({
    address: i.address,
    balance: Number(i.amount),
    label: i.label,
    avatarUrl: ''
  }))
  addresses = addresses.map(i => {
    const ping = addressesping.find(x => x[0] === i.address)
    
    if (!ping) {
      return i
    }

    // gets real balance. listreceivedbyaddress gets total received instead of current balance
    i.balance = Number(ping[1])
    return i
  })

  return resolve(addresses)
})

// Get assets
const getAssets = () => syscoin.callRpc('listassets', [])

// Get asset info
const getAssetInfo = (asset: number) => syscoin.callRpc('assetinfo', [asset])

// Get asset allocation info
const getAssetAllocationInfo = (obj: AllocationInfoType) => syscoin.walletServices.assetAllocation.info(obj.assetId, obj.aliasName, false)

const sendAsset = (obj: SendAssetType) => new Promise(async (resolve, reject) => {
  // Sends asset to specific alias
  const { fromAlias, toAlias, assetId, amount } = obj
  let assetSend
  let signTransaction
  let isOwner

  try {
    isOwner = await isAddressOwnerOfAsset(fromAlias, Number(assetId))
  } catch (err) {
    return reject(err)
  }
  
  try {
    if (isOwner) {
      assetSend = await syscoin.callRpc('assetsend', [Number(assetId), toAlias, amount])
    } else {
      assetSend = await syscoin.callRpc('assetallocationsend', [Number(assetId), fromAlias, toAlias, amount])
    }
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

const createNewAsset = (obj: Object) => new Promise(async (resolve, reject) => {
  let asset
  let signRaw

  try {
    asset = await assetNew(obj)
    signRaw = await signRawTransaction(asset.hex)
    await sendRawTransaction(signRaw.hex)
  } catch(error) {
    return reject(error)
  }

  return resolve(asset)
})

const assetNew = (obj: Object) => {
  const { address, symbol, publicValue, contract, precision, supply, maxSupply, updateFlags, witness } = obj
  return syscoin.callRpc('assetnew', [address, symbol, publicValue, contract, precision, supply, maxSupply, updateFlags, witness])
}

const signRawTransaction = (str) => syscoin.callRpc('signrawtransactionwithwallet', [str])
const sendRawTransaction = (str) => syscoin.callRpc('sendrawtransaction', [str])

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
const getBlockchainInfo = () => syscoin.callRpc('getblockchaininfo', [])

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
      const assetIndex = balancesByAssets.findIndex(z => z.asset_guid === x.asset_guid && z.isOwner === x.isOwner)

      if (assetIndex !== -1) {
        balancesByAssets[assetIndex].balance = (Number(balancesByAssets[assetIndex].balance) + Number(x.balance))
        balancesByAssets[assetIndex].balance_zdag = (Number(balancesByAssets[assetIndex].balance_zdag) + Number(x.balance_zdag))
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

const encryptWallet = (pass: string) => syscoin.callRpc('encryptwallet', [pass])
const unlockWallet = (pass: string, time: number) => syscoin.callRpc('walletpassphrase', [pass, time])
const changePwd = (oldPwd: string, newPwd: string) => syscoin.callRpc('walletpassphrasechange', [oldPwd, newPwd])
const lockWallet = () => syscoin.callRpc('walletlock', [])

const isEncrypted = () => new Promise(async (resolve, reject) => {
  let output

  try {
    output = await syscoin.callRpc('getwalletinfo', [])
  } catch (err) {
    return reject(err)
  }

  return resolve(Object.keys(output).indexOf('unlocked_until') !== -1)
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

const getAssetBalancesByAddress = (address: string) => new Promise(async (resolve, reject) => {
  let allocations
  let assets

  try {
    allocations = await syscoin.callRpc('listassetindexallocations', [address])
    allocations = await Promise.all(
      allocations.map(async i => {
        const asset = {...i}

        asset.publicvalue = (await getAssetInfo(i.asset_guid)).publicvalue

        return asset
      })
    )
    assets = await getAssetOwnedByAddress(address)

    allocations = allocations.concat(assets)
  } catch(err) {
    return reject(err)
  }

  return resolve(allocations)
})

const getAssetOwnedByAddress = (address: string) => new Promise(async (resolve, reject) => {
  let allocations

  try {
    allocations = await syscoin.callRpc('listassetindexassets', [address])
    allocations = await Promise.all(
      allocations.map(async i => {
        const asset = {...i}

        // See if can remove this when symbol is present
        asset.publicvalue = (await getAssetInfo(i.asset_guid)).publicvalue
        asset.isOwner = true

        return asset
      })
    )
  } catch(err) {
    return reject(err)
  }

  return resolve(allocations)
})

const getNewAddress = () => syscoin.callRpc('getnewaddress', [])
const isAddressOwnerOfAsset = (address: string, guid: number) => new Promise(async (resolve, reject) => {
  let assetsOwned

  try {
    assetsOwned = await getAssetOwnedByAddress(address)
  } catch (err) {
    return reject(err)
  }

  return resolve(!!assetsOwned.find(i => i.asset_guid === guid && i.isOwner))
})
const editLabel = (address: string, label: string) => syscoin.callRpc('setlabel', [address, label])

const updateAsset = (obj: Object) => new Promise(async (resolve, reject) => {
  const { assetGuid, publicValue, contract, supply, updateFlags } = obj
  let hex
  let raw

  try {
    hex = await syscoin.callRpc('assetupdate', [assetGuid, publicValue, contract, supply, updateFlags, ''])
    raw = await signRawTransaction(hex.hex)
    await sendRawTransaction(raw.hex)
  } catch (err) {
    return reject(err)
  }

  return resolve()
})

module.exports = {
  callRpc: syscoin.callRpc,
  aliasInfo,
  currentSysAddress,
  currentBalance,
  createNewAsset,
  editAlias,
  editLabel,
  getAllTokenBalances,
  getAddresses,
  getAssetInfo,
  getAssetAllocationInfo,
  getAssetBalancesByAddress,
  getNewAddress,
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
  getAssets,
  updateAsset
}
