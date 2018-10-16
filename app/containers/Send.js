// @flow
import React, { Component } from 'react'
import { connect } from 'react-redux'
import Send from 'fw-components/Send'
import {
  getAssetAllocationInfo,
  sendAsset,
  sendSysTransaction
} from 'fw-sys'


type Props = {
  balance: number,
  aliases: Array<Object>,
  assets: Array<string>
};
type State = {
  assetIsLoading: boolean,
  sysIsLoading: boolean
};

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
type sendSysType = {
  amount: string,
  address: string,
  comment: string
};

class SendContainer extends Component<Props, State> {

  constructor() {
    super()

    this.state = {
      assetIsLoading: false,
      sysIsLoading: false
    }
  }

  async isUserAssetOwner(obj: isUserAssetOwnerType) {
    let result

    try {
      result = await getAssetAllocationInfo({
        assetId: obj.asset,
        aliasName: obj.alias
      })
    } catch (err) {
      return false
    }

    return result
  }

  async sendAsset(obj: sendAssetType, cb: Function) {
    const { from, asset, toAddress, amount } = obj

    let sendResult

    this.setState({
      assetIsLoading: true
    })

    try {
      await this.isUserAssetOwner({
        alias: from,
        asset
      })
    } catch (err) {
      this.setState({
        assetIsLoading: false
      })
      return cb(err)
    }

    try {
      sendResult = await sendAsset({
        fromAlias: from,
        toAlias: toAddress,
        assetId: asset,
        amount
      })
    } catch (sendErr) {
      this.setState({
        assetIsLoading: false
      })
      return cb(sendErr)
    }

    this.setState({
      assetIsLoading: false
    })

    return cb(null, sendResult)
  }

  async sendSys(obj: sendSysType, cb: Function) {

    this.setState({
      sysIsLoading: true
    })

    let result

    try {
      result = await sendSysTransaction(obj)
    } catch (err) {
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
        balance={this.props.balance}
        assetIsLoading={this.state.assetIsLoading}
        sysIsLoading={this.state.sysIsLoading}
        aliases={this.props.aliases.map(i => i.alias || i.address)}
        sendAsset={this.sendAsset.bind(this)}
        sendSys={this.sendSys.bind(this)}
        assets={this.props.assets}
      />
    )
  }
}

const mapStateToProps = state => ({
  balance: state.wallet.getinfo.balance,
  aliases: state.wallet.aliases,
  assets: state.options.guids
})

export default connect(mapStateToProps)(SendContainer)
