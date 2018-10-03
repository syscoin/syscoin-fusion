// @flow
const { exec } = require('child_process')
const generateCmd = require('../cmd-gen')
const { waterfall } = require('async')

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
  amount: string
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

const getInfo = () => new Promise((resolve, reject) => {
  exec(generateCmd('cli', 'getinfo'), (err, stdout) => {
    if (err) {
      return reject(err)
    }

    return resolve(JSON.parse(stdout))
  })
})

const currentSysAddress = (cb: (error: boolean, address?: string) => void) => {
  // Get current SYS address
  exec(generateCmd('cli', 'getaccountaddress ""'), (err, stdout, stderror) => {
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
  exec(generateCmd('cli', 'getbalance'), (err, stdout, stderror) => {
    if (err || stderror) {
      return reject(err || stderror)
    }

    return resolve(stdout.toString())
  })
})

// Get current aliases
const getAliases = () => new Promise((resolve, reject) => {
  exec(generateCmd('cli', 'syscoinlistreceivedbyaddress'), (err, stdout, stderror) => {
    if (err || stderror) {
      return reject(err || stderror)
    }

    return resolve(JSON.parse(stdout.toString()))
  })
})

const getAssetInfo = (assetId: string) => new Promise((resolve, reject) => {
  exec(generateCmd('cli', `assetinfo ${assetId} false`), (err, stdout, stderror) => {
    if (err || stderror.toString().length) {
      return reject(err)
    }

    return resolve(JSON.parse(stdout.toString()))
  })
})

// Get asset allocation info
const getAssetAllocationInfo = (obj: AllocationInfoType) => new Promise((resolve, reject) => {
  exec(generateCmd('cli', `assetallocationinfo ${obj.assetId} ${obj.aliasName} false`), (err, stdout, stderror) => {
    if (err || stderror.toString().length) {
      return reject(err)
    }

    return resolve(JSON.parse(stdout.toString()))
  })
})

const sendAsset = (obj: SendAssetType) => new Promise((resolve, reject) => {
  // Sends asset to specific alias
  const { fromAlias, toAlias, assetId, amount } = obj

  waterfall([
    done => {
      exec(generateCmd('cli', `assetallocationsend ${assetId} ${fromAlias} [{\\"ownerto\\":\\"${toAlias}\\",\\"amount\\":${amount}}] "" ""`), (err, result) => {
        if (err) {
          if (err.message.indexOf('ERRCODE: 1018') !== -1) {
            return done(null)
          }
          return done(err)
        }

        done(null, JSON.parse(result.toString())[0])
      })
    },
    (firstOutput, done) => {
      if (!firstOutput) {
        return exec(generateCmd('cli', `assetallocationsend ${assetId} ${fromAlias} [{\\"ownerto\\":\\"${toAlias}\\",\\"ranges\\": [{\\"start\\": 0, \\"end\\": ${parseFloat(amount)}}]}] "" ""`), (errTwo, resultTwo) => {
          if (errTwo) {
            return done(errTwo)
          }

          done(null, JSON.parse(resultTwo.toString())[0])
        })
      }

      done(null, firstOutput)
    },
    (assetAllocationOutput, done) => {
      exec(generateCmd('cli', `signrawtransaction ${assetAllocationOutput}`), (errSign, resultSign) => {
        if (errSign) {
          return done(errSign)
        }

        done(null, JSON.parse(resultSign.toString()).hex)
      })
    },
    (signOutput, done) => {
      exec(generateCmd('cli', `syscoinsendrawtransaction ${signOutput}`), (errSend, resultSend) => {
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
  exec(generateCmd('cli', `sendtoaddress ${address} ${amount} "${comment || ''}"`), (err, result) => {
    if (err) {
      return reject(err)
    }

    return resolve(result)
  })
})

const createNewAlias = (obj: Object) => new Promise((resolve, reject) => {
  // Creates new alias
  const { aliasName, publicValue, acceptTransferFlags, expireTimestamp, address, encryptionPrivKey, encryptionPublicKey, witness } = obj
  console.log(generateCmd('cli', `aliasnew ${aliasName} "${publicValue || ''}" ${acceptTransferFlags || 3} ${expireTimestamp || 1548184538} "${address || ''}" "${encryptionPrivKey || ''}" "${encryptionPublicKey || ''}" "${witness || ''}"`))
  waterfall([
    done => {
      exec(generateCmd('cli', `aliasnew ${aliasName} "${publicValue || ''}" ${acceptTransferFlags || 3} ${expireTimestamp || 1548184538} "${address || ''}" "${encryptionPrivKey || ''}" "${encryptionPublicKey || ''}" "${witness || ''}"`), (err, result) => {
        try {
          done(err, JSON.parse(result)[0])
        } catch (e) {
          done(err)
        }
      })
    },
    (firstResult, done) => {
      exec(generateCmd('cli', `syscointxfund ${firstResult}`), (err, result) => {
        try {
          done(err, JSON.parse(result)[0])
        } catch (e) {
          done(err)
        }
      })
    },
    (secondResult, done) => {
      exec(generateCmd('cli', `signrawtransaction ${secondResult}`), (err, result) => {
        try {
          done(err, JSON.parse(result).hex)
        } catch (e) {
          done(err)
        }
      })
    },
    (thirdResult, done) => {
      exec(generateCmd('cli', `syscoinsendrawtransaction ${thirdResult}`), (err, result) => {
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

const exportWallet = (backupDir: string) => new Promise((resolve, reject) =>{
  exec(generateCmd('cli', `dumpwallet "${backupDir}"`), (err) => {
    if (err) {
      return reject(err)
    }

    return resolve()
  })
})

const importWallet = (backupDir: string) => new Promise((resolve, reject) => {
  exec(generateCmd('cli', `importwallet "${backupDir}"`), (err) => {
    if (err) {
      return reject(err)
    }

    return resolve()
  })
})

const getPrivateKey = () => new Promise((resolve, reject) => {
  currentSysAddress((err, address) => {
    if (err) {
      return reject(err)
    }
    exec(generateCmd('cli', `dumpprivkey "${address}"`), (errDump, key) => {
      if (errDump) {
        return reject(errDump)
      }

      return resolve(key)
    })
  })
})

const editAlias = (obj: Object, cb: (error: boolean) => void) => {
  const { aliasName, publicValue, address, acceptTransfersFlag, expireTimestamp, encPrivKey, encPubKey, witness } = obj

  waterfall([
    done => {
      exec(generateCmd('cli', `aliasupdate ${aliasName} "${publicValue || ''}" ${address || ''} ${acceptTransfersFlag || 3} ${expireTimestamp || 1548184538} "${encPrivKey || ''}" "${encPubKey || ''}" "${witness || ''}"`), (err, result) => {
        try {
          done(err, JSON.parse(result)[0])
        } catch (e) {
          done(err)
        }
      })
    },
    (firstResult, done) => {
      exec(generateCmd('cli', `signrawtransaction ${firstResult}`), (err, result) => {
        try {
          done(err, JSON.parse(result).hex)
        } catch (e) {
          done(err)
        }
      })
    },
    (secondResult, done) => {
      exec(generateCmd('cli', `syscoinsendrawtransaction ${secondResult}`), (err, result) => {
        done(err, result)
      })
    }
  ], (err) => {
    if (err) {
      return cb(err)
    }

    return cb(false)
  })
}

const aliasInfo = (name: string, cb: (error: boolean, cb: Function) => void) => {
  exec(generateCmd('cli', `aliasinfo ${name}`), (err, result) => {
    try {
      return cb(err, JSON.parse(result))
    } catch (e) {
      return cb(err, null)
    }
  })
}

const getTransactionsPerAsset = (obj: getTransactionsPerAssetType) => new Promise((resolve, reject) => {
  exec(generateCmd('cli', `listassetallocationtransactions 1999999999`), {
    maxBuffer: 1024 * 500
  }, (err, result) => {
    if (err) {
      return reject(err)
    }

    // Parse JSON and filter out transactions that dont include selected alias. Then remove any undesired stuff from response
    const data = JSON.parse(result)
      .filter(i => i.asset === obj.assetId && (i.sender === obj.alias || i.receiver === obj.alias))
      .map(i => {
        const asset = { ...i }
        asset.amount = asset.amount[0] === '-' ? asset.amount.slice(1) : asset.amount
        asset.time = (new Date(0)).setUTCSeconds(asset.time)
        return asset
      })

    return resolve(data)
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
  sendAsset,
  sendSysTransaction,
  createNewAlias,
  exportWallet,
  importWallet,
  getPrivateKey,
  getTransactionsPerAsset
}
