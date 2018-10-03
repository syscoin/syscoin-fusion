// @flow
import React, { Component } from 'react'
import { connect } from 'react-redux'
import Send from 'fw-components/Wallet/Send/'
import {
  getAliases,
  getAssetAllocationInfo,
  sendAsset,
  sendSysTransaction
} from 'fw-sys'


type Props = {
  balance: number
};
type State = {
  assetIsLoading: boolean,
  sysIsLoading: boolean,
  aliases: Array<Object>
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
      sysIsLoading: false,
      aliases: []
    }
  }

  componentDidMount() {
    this.getAliases()
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

  async getAliases() {
    let aliases
    try {
      aliases = await getAliases()
    } catch (err) {
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
        aliases={this.state.aliases.map(i => i.alias || i.address)}
        sendAsset={this.sendAsset.bind(this)}
        sendSys={this.sendSys.bind(this)}
      />
    )
  }
}

const mapStateToProps = state => ({
  balance: state.wallet.getinfo.balance
})

export default connect(mapStateToProps)(SendContainer)
