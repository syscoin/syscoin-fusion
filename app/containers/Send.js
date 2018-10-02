// @flow
import React, { Component } from 'react'

import Send from 'fw-components/Wallet/Send/'
import {
  getAliases,
  getAssetAllocationInfo,
  sendAsset,
  sendSysTransaction
} from 'fw-sys'

type isUserAssetOwnerType = {
  alias: string,
  asset: string
};
type sendAssetType = {
  from: string,
  asset: string,
  toAddress: string,
  amount: string
};

type Props = {};
type State = {
  assetIsLoading: boolean,
  sysIsLoading: boolean,
  aliases: Array<Object>
};

type sendSysType = {
  amount: string,
  address: string,
  comment: string
};

export default class SendContainer extends Component<Props, State> {

  constructor() {
    super()

    this.state = {
      assetIsLoading: false,
      sysIsLoading: false,
      aliases: []
    }
  }

  componentDidMount() {
    this.getAliases()
  }

  async isUserAssetOwner(obj: isUserAssetOwnerType, cb: Function) {
    let result

    try {
      result = await getAssetAllocationInfo({
        assetId: obj.asset,
        aliasName: obj.alias
      })
    } catch(err) {
      return cb(true)
    }

    return cb(null, result)
  }

  sendAsset(obj: sendAssetType, cb: Function) {
    const { from, asset, toAddress, amount } = obj

    let sendResult

    this.setState({
      assetIsLoading: true
    })

    this.isUserAssetOwner({
      alias: from,
      asset
    }, async (err) => {
      if (err) {
        this.setState({
          assetIsLoading: false
        })
        return cb(true)
      }

      try {
        sendResult = await sendAsset({
          fromAlias: from,
          toAlias: toAddress,
          assetId: asset,
          amount
        })
      } catch(sendErr) {
        this.setState({
          assetIsLoading: false
        })
        return cb(sendErr)
      }

      this.setState({
        assetIsLoading: false
      })

      return cb(null, sendResult)
    })
  }

  async getAliases() {
    let aliases
    try {
      aliases = await getAliases()
    } catch(err) {
      return []
    }

    this.setState({
      aliases
    })
  }

  async sendSys(obj: sendSysType, cb: Function) {

    this.setState({
      sysIsLoading: true
    })

    let result

    try {
      result = await sendSysTransaction(obj)
    } catch(err) {
      this.setState({
        sysIsLoading: false
      })
      return cb(err)
    }

    this.setState({
      sysIsLoading: false
    })

    return cb(null, result)
  }

  render() {
    return (
      <Send
        assetIsLoading={this.state.assetIsLoading}
        sysIsLoading={this.state.sysIsLoading}
        aliases={this.state.aliases.map(i => i.alias || i.address)}
        sendAsset={this.sendAsset.bind(this)}
        sendSys={this.sendSys.bind(this)}
      />
    )
  }
}
