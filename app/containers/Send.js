// @flow
import React, { Component } from 'react'
import { connect } from 'react-redux'
import Send from 'fw-components/Send'
import {
  listAssetAllocation,
  sendAsset,
  sendSysTransaction
} from 'fw-sys'


type Props = {
  balance: number,
  aliases: Array<Object>
};
type State = {
  assetsFromAlias: Array<Object>,
  assetsFromAliasIsLoading: boolean,
  assetIsLoading: boolean,
  sysIsLoading: boolean
};

type sendAssetType = {
  from: string,
  asset: string,
  toAddress: string,
  amount: string,
  comment?: string
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
      assetsFromAlias: [],
      assetsFromAliasIsLoading: false,
      assetIsLoading: false,
      sysIsLoading: false,
    }
  }

  async sendAsset(obj: sendAssetType, cb: Function) {
    const { from, asset, toAddress, amount, comment } = obj

    let sendResult

    this.setState({
      assetIsLoading: true
    })

    try {
      sendResult = await sendAsset({
        fromAlias: from,
        toAlias: toAddress,
        assetId: asset,
        amount,
        comment
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

  async getAssetsFromAlias(alias: string, cb?: Function) {
    const { assets } = this.props
    this.setState({
      assetsFromAliasIsLoading: true,
      assetsFromAlias: []
    })

    let data

    try {
      data = await listAssetAllocation({
        receiver_address: alias
      }, assets.map(i => i._id))
    } catch(err) {
      this.setState({
        assetsFromAliasIsLoading: false,
        assetsFromAlias: []
      })
      return cb(err)
    }

    this.setState({
      assetsFromAliasIsLoading: false,
      assetsFromAlias: data
    })
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
        getAssetsFromAlias={this.getAssetsFromAlias.bind(this)}
        assets={this.state.assetsFromAlias}
        assetsFromAliasIsLoading={this.state.assetsFromAliasIsLoading}
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
