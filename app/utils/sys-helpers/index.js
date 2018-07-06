// @flow
const { exec } = require('child_process')
const generateCmd = require('../cmd-gen')

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

const currentSysAddress = (cb: (error: boolean, address?: string) => void) => {
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

const currentBalance = (cb: (error: boolean, balance?: string) => void) => {
  exec(generateCmd('cli', 'getbalance'), (err, stdout, stderror) => {
    if (err) {
      return cb(true)
    }

    if (stderror.toString().length) {
      return cb(false, '')
    }

    return cb(false, stdout.toString())
  })
}

const getAliases = (cb: (error: boolean, addresses?: Array<any>) => void) => {
  exec(generateCmd('cli', 'syscoinlistreceivedbyaddress'), (err, stdout, stderror) => {
    if (err) {
      return cb(false, [])
    }

    if (stderror.toString().length) {
      return cb(false, [])
    }

    return cb(false, JSON.parse(stdout.toString()) || [])
  })
}

const getAssetInfo = (obj: AllocationInfoType, cb: (error: boolean, info?: any) => void) => {
  exec(generateCmd('cli', `assetallocationinfo ${obj.assetId} ${obj.aliasName} false`), (err, stdout, stderror) => {
    if (err || stderror.toString().length) {
      return cb(true)
    }

    return cb(false, JSON.parse(stdout.toString()))
  })
}

const sendAsset = (obj: SendAssetType, cb: (error: boolean, result?: boolean) => void) => {
  const { fromAlias, toAlias, assetId, amount } = obj
  exec(generateCmd('cli', `assetallocationsend ${assetId} ${fromAlias} [{\\"aliasto\\":\\"${toAlias}\\",\\"amount\\":${amount}}] "" ""`), (err, result) => {
    if (err) {
      return cb(true)
    }

    const assetAllocationOutput = JSON.parse(result.toString())[0]

    exec(generateCmd('cli', `signrawtransaction ${assetAllocationOutput}`), (errSign, resultSign) => {
      if (errSign) {
        return cb(true)
      }

      const signOutput = JSON.parse(resultSign.toString()).hex

      exec(generateCmd('cli', `syscoinsendrawtransaction ${signOutput}`), (err, resultSend) => {
        if (err) {
          return cb(true)
        }

        return cb(false, true)
      })
    })
  })
}

module.exports = {
  currentSysAddress,
  currentBalance,
  getAliases,
  getAssetInfo,
  sendAsset
}
