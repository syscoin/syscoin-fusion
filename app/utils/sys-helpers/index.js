// @flow
const { exec } = require('child_process')
const generateCmd = require('../cmd-gen')
const { waterfall, parallel } = require('async')

/*
  SYS helpers. All results are returned following the callback pattern.
  All functions accepts a callback, where the first argument is always an error and the second one is the results.
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
  receiver_address?: string,
  txid?: string,
  asset?: string,
  receiver_alias?: string,
  startblock?: number
};

const getInfo = () => new Promise((resolve, reject) => {
  const cmd = generateCmd('cli', 'getinfo')
  console.time(cmd)
  exec(cmd, (err, stdout) => {
    console.timeEnd(cmd)
    if (err) {
      return reject(err)
    }

    try {
      return resolve(JSON.parse(stdout))
    } catch (errParse) {
      return reject(errParse)
    }

  })
})

const currentSysAddress = (cb: (error: boolean, address?: string) => void) => {
  const cmd = generateCmd('cli', 'getaccountaddress ""')
  console.time(cmd)
  // Get current SYS address
  exec(cmd, (err, stdout, stderror) => {
    console.timeEnd(cmd)
    if (err) {
      return cb(true)
    }

    if (stderror.toString().length) {
      return cb(false, '')
    }

    return cb(false, stdout.toString())
  })
}

// Get current SYS Balance
const currentBalance = () => new Promise((resolve, reject) => {
  const cmd = generateCmd('cli', 'getbalance')
  console.time(cmd)
  exec(cmd, (err, stdout, stderror) => {
    console.timeEnd(cmd)
    if (err || stderror) {
      return reject(err || stderror)
    }

    return resolve(stdout.toString())
  })
})

// Get current aliases
const getAliases = () => new Promise((resolve, reject) => {
  const cmd = generateCmd('cli', 'syscoinlistreceivedbyaddress')
  console.time(cmd)
  exec(cmd, (err, stdout, stderror) => {
    console.timeEnd(cmd)
    if (err || stderror) {
      return reject(err || stderror)
    }

    try {
      return resolve(JSON.parse(stdout.toString()))
    } catch (errParse) {
      return reject(errParse)
    }

  })
})

const getAssetInfo = (assetId: string) => new Promise((resolve, reject) => {
  const cmd = generateCmd('cli', `assetinfo ${assetId} false`)
  console.time(cmd)
  exec(cmd, (err, stdout, stderror) => {
    console.timeEnd(cmd)
    if (err || stderror.toString().length) {
      return reject(err)
    }

    try {
      return resolve(JSON.parse(stdout.toString()))
    } catch (errParse) {
      return reject(errParse)
    }
  })
})

// Get asset allocation info
const getAssetAllocationInfo = (obj: AllocationInfoType) => new Promise((resolve, reject) => {
  const cmd = generateCmd('cli', `assetallocationinfo ${obj.assetId} ${obj.aliasName} false`)
  console.time(cmd)
  exec(cmd, (err, stdout, stderror) => {
    console.timeEnd(cmd)
    if (err || stderror.toString().length) {
      return reject(err)
    }

    try {
      return resolve(JSON.parse(stdout.toString()))
    } catch (errParse) {
      return reject(errParse)
    }
  })
})

const sendAsset = (obj: SendAssetType) => new Promise((resolve, reject) => {
  // Sends asset to specific alias
  const { fromAlias, toAlias, assetId, amount, comment } = obj

  waterfall([
    done => {
      const cmd = generateCmd('cli', `assetallocationsend ${assetId} ${fromAlias} [{\\"ownerto\\":\\"${toAlias}\\",\\"amount\\":${amount}}] "${comment || ''}" ""`)
      console.time(cmd)
      exec(cmd, (err, result) => {
        console.timeEnd(cmd)
        if (err) {
          if (err.message.indexOf('ERRCODE: 1018') !== -1) {
            return done(null)
          }
          return done(err)
        }

        try {
          done(null, JSON.parse(result.toString())[0])
        } catch (errParse) {
          done(errParse)
        }
      })
    },
    (firstOutput, done) => {
      if (!firstOutput) {
        const cmd = generateCmd('cli', `assetallocationsend ${assetId} ${fromAlias} [{\\"ownerto\\":\\"${toAlias}\\",\\"ranges\\": [{\\"start\\": 0, \\"end\\": ${parseFloat(amount)}}]}] "" ""`)
        console.time(cmd)
        return exec(cmd, (errTwo, resultTwo) => {
          console.timeEnd(cmd)
          if (errTwo) {
            return done(errTwo)
          }

          try {
            done(null, JSON.parse(resultTwo.toString())[0])
          } catch (errParse) {
            done(errParse)
          }
        })
      }

      done(null, firstOutput)
    },
    (assetAllocationOutput, done) => {
      const cmd = generateCmd('cli', `signrawtransaction ${assetAllocationOutput}`)
      console.time(cmd)
      exec(cmd, (errSign, resultSign) => {
        console.timeEnd(cmd)
        if (errSign) {
          return done(errSign)
        }

        try {
          done(null, JSON.parse(resultSign.toString()).hex)
        } catch (errParse) {
          done(errParse)
        }
      })
    },
    (signOutput, done) => {
      const cmd = generateCmd('cli', `syscoinsendrawtransaction ${signOutput}`)
      console.time(cmd)
      exec(cmd, (errSend, resultSend) => {
        console.timeEnd(cmd)
        if (errSend) {
          return done(errSend)
        }

        return done(false, resultSend)
      })
    }
  ], (err) => {
    if (err) {
      return reject(err)
    }

    resolve()
  })
})

const sendSysTransaction = (obj: sendSysTransactionType) => new Promise((resolve, reject) => {
  // Send SYS to address
  const { address, amount, comment } = obj
  const cmd = generateCmd('cli', `sendtoaddress ${address} ${amount} "${comment || ''}"`)
  console.time(cmd)
  exec(cmd, (err, result) => {
    console.timeEnd(cmd)
    if (err) {
      return reject(err)
    }

    return resolve(result)
  })
})

const createNewAlias = (obj: Object) => new Promise((resolve, reject) => {
  // Creates new alias
  const { aliasName, publicValue, acceptTransferFlags, expireTimestamp, address, encryptionPrivKey, encryptionPublicKey, witness } = obj
  waterfall([
    done => {
      const cmd = generateCmd('cli', `aliasnew ${aliasName} "${publicValue || ''}" ${acceptTransferFlags || 3} ${expireTimestamp || 1548184538} "${address || ''}" "${encryptionPrivKey || ''}" "${encryptionPublicKey || ''}" "${witness || ''}"`)
      console.time(cmd)
      exec(cmd, (err, result) => {
        console.timeEnd(cmd)
        try {
          done(err, JSON.parse(result)[0])
        } catch (e) {
          done(err)
        }
      })
    },
    (firstResult, done) => {
      const cmd = generateCmd('cli', `syscointxfund ${firstResult}`)
      console.time(cmd)
      exec(cmd, (err, result) => {
        console.timeEnd(cmd)
        try {
          done(err, JSON.parse(result)[0])
        } catch (e) {
          done(err)
        }
      })
    },
    (secondResult, done) => {
      const cmd = generateCmd('cli', `signrawtransaction ${secondResult}`)
      console.time(cmd)
      exec(cmd, (err, result) => {
        console.timeEnd(cmd)
        try {
          done(err, JSON.parse(result).hex)
        } catch (e) {
          done(err)
        }
      })
    },
    (thirdResult, done) => {
      const cmd = generateCmd('cli', `syscoinsendrawtransaction ${thirdResult}`)
      console.time(cmd)
      exec(cmd, (err, result) => {
        console.timeEnd(cmd)
        done(err, result)
      })
    }
  ], (err, result) => {
    if (err) {
      return reject(err)
    }

    return resolve(result)
  })
})

const exportWallet = (backupDir: string) => new Promise((resolve, reject) => {
  const cmd = generateCmd('cli', `dumpwallet "${backupDir}"`)
  console.time(cmd)
  exec(cmd, (err) => {
    console.timeEnd(cmd)
    if (err) {
      return reject(err)
    }

    return resolve()
  })
})

const importWallet = (backupDir: string) => new Promise((resolve, reject) => {
  const cmd = generateCmd('cli', `importwallet "${backupDir}"`)
  console.time(cmd)
  exec(cmd, (err) => {
    console.timeEnd(cmd)
    if (err) {
      return reject(err)
    }

    return resolve()
  })
})

const getPrivateKey = (address) => new Promise((resolve, reject) => {
  const cmd = generateCmd('cli', `dumpprivkey "${address}"`)
  console.time(cmd)
  exec(cmd, (err, key) => {
    console.timeEnd(cmd)
    if (err) {
      return reject(err)
    }

    return resolve(key)
  })
})

const editAlias = (obj: Object) => new Promise((resolve, reject) => {
  const { aliasName, publicValue, address, acceptTransfersFlag, expireTimestamp, encPrivKey, encPubKey, witness } = obj

  waterfall([
    done => {
      const cmd = generateCmd('cli', `aliasupdate ${aliasName} "${publicValue || ''}" ${address || ''} ${acceptTransfersFlag || 3} ${expireTimestamp || 1548184538} "${encPrivKey || ''}" "${encPubKey || ''}" "${witness || ''}"`)
      console.time(cmd)
      exec(cmd, (err, result) => {
        console.timeEnd(cmd)
        try {
          done(err, JSON.parse(result)[0])
        } catch (e) {
          done(err)
        }
      })
    },
    (firstResult, done) => {
      const cmd = generateCmd('cli', `signrawtransaction ${firstResult}`)
      console.time(cmd)
      exec(cmd, (err, result) => {
        console.timeEnd(cmd)
        try {
          done(err, JSON.parse(result).hex)
        } catch (e) {
          done(err)
        }
      })
    },
    (secondResult, done) => {
      const cmd = generateCmd('cli', `syscoinsendrawtransaction ${secondResult}`)
      console.time(cmd)
      exec(cmd, (err, result) => {
        console.timeEnd(cmd)
        done(err, result)
      })
    }
  ], (err) => {
    if (err) {
      return reject(err)
    }

    return resolve()
  })
})

const aliasInfo = (name: string) => new Promise((resolve, reject) => {
  const cmd = generateCmd('cli', `aliasinfo ${name}`)
  console.time(cmd)
  exec(cmd, (err, result) => {
    console.timeEnd(cmd)
    try {
      return resolve(JSON.parse(result))
    } catch (e) {
      return reject(err)
    }
  })
})

const getTransactionsPerAsset = (obj: getTransactionsPerAssetType) => new Promise((resolve, reject) => {
  parallel([
    (done) => {
      const cmd = generateCmd('cli', `listassetallocationtransactions 999999 0 "{\\"sender_address\\": \\"${obj.alias}\\", \\"asset\\": \\"${obj.assetId}\\"}"`)
      console.time(cmd)
      exec(cmd, {
        maxBuffer: 1024 * 20480
      }, (err, result) => {
        console.timeEnd(cmd)
        if (err) {
          return done(err)
        }

        try {
          return done(null, JSON.parse(result.toString()))
        } catch (errParse) {
          return done(errParse)
        }
      })
    },
    (done) => {
      const cmd = generateCmd('cli', `listassetallocationtransactions 999999 0 "{\\"receiver_address\\": \\"${obj.alias}\\", \\"asset\\": \\"${obj.assetId}\\"}"`)
      console.time(cmd)
      exec(cmd, {
        maxBuffer: 1024 * 20480
      }, (err, result) => {
        console.timeEnd(cmd)
        if (err) {
          return done(err)
        }

        try {
          return done(null, JSON.parse(result.toString()))
        } catch (errParse) {
          return done(errParse)
        }
      })
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

const getAssetAllocationTransactions = () => new Promise((resolve, reject) => {
  const cmd = generateCmd('cli', `listassetallocationtransactions 1999999999`)
  console.time(cmd)
  exec(cmd, {
    maxBuffer: 1024 * 20480
  }, (err, result) => {
    console.timeEnd(cmd)
    if (err) {
      return reject(err)
    }

    try {
      return resolve(JSON.parse(result.toString()))
    } catch (errParse) {
      return reject(errParse)
    }
  })
})

const listAssets = () => new Promise((resolve, reject) => {
  const cmd = generateCmd('cli', 'listassets')
  console.time(cmd)
  exec(cmd, (err, result) => {
    console.timeEnd(cmd)
    if (err) {
      return reject(err)
    }

    try {
      return resolve(JSON.parse(result))
    } catch (errParse) {
      return reject(errParse)
    }
  })
})

const getBlockchainInfo = () => new Promise((resolve, reject) => {
  const cmd = generateCmd('cli', 'getblockchaininfo')
  console.time(cmd)
  exec(cmd, (err, result) => {
    console.timeEnd(cmd)
    if (err) {
      return reject(err)
    }

    try {
      return resolve(JSON.parse(result))
    } catch (errParse) {
      return reject(errParse)
    }
  })
})

const listAssetAllocation = (obj: listAssetAllocationType, filterGuids?: Array<string>) => new Promise((resolve, reject) => {
  const cmd = generateCmd('cli', `listassetallocations 999999 0 "${JSON.stringify(obj).replace(/"/g, '\\"')}"`)
  console.time(cmd)
  exec(cmd, (err, result) => {
    console.timeEnd(cmd)
    if (err) {
      return reject(err)
    }
    let data

    try {
      data = JSON.parse(result)
    } catch (errParse) {
      return reject(errParse)
    }

    if (Array.isArray(filterGuids) && filterGuids.length) {
      data = data.filter(i => filterGuids.indexOf(i.asset) !== -1)
    }

    return resolve(data)
  })
})

const listSysTransactions = (page: number = 0, pageSize: number = 10) => new Promise((resolve, reject) => {
  const cmd = generateCmd('cli', `listtransactions "*" ${pageSize} ${page * pageSize}`)
  console.time(cmd)
  exec(cmd, (err, result) => {
    console.timeEnd(cmd)
    if (err) {
      return reject(err)
    }

    try {
      return resolve(
        JSON.parse(result).map(i => {
          const obj = {...i}
          obj.time = (new Date(0)).setUTCSeconds(i.time)
          return obj
        })
      )
    } catch(errParse) {
      return reject(errParse)
    }
  })
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
  listAssets,
  getBlockchainInfo,
  getAssetAllocationTransactions,
  listSysTransactions
}
