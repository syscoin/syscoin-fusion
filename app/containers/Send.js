// @flow
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Send from 'fw-components/Send'
import {
  listAssetAllocation
} from 'fw-sys'
import {
  editSendAsset,
  editSendSys,
  sendAssetForm,
  sendSysForm
} from 'fw-actions/forms'
import unlockWallet from 'fw-utils/unlock-wallet'


type Props = {
  assets: Array<Object>,
  balance: number,
  aliases: Array<Object>,
  sendAssetForm: Function,
  sendSysForm: Function,
  editSendAsset: Function,
  editSendSys: Function,
  sysForm: Object,
  assetForm: Object,
  isEncrypted: boolean
};
type State = {
  assetsFromAlias: Array<Object>,
  assetsFromAliasIsLoading: boolean
};

type sendAssetType = {
  from: string,
  asset: string,
  toAddress: string,
  amount: string,
  comment?: string
};
type sendSysType = {
  amount: number,
  address: string,
  comment: string
};

class SendContainer extends Component<Props, State> {

  constructor(props: Props) {
    super(props)

    this.state = {
      assetsFromAlias: [],
      assetsFromAliasIsLoading: false
    }
  }

  sendAsset(obj: sendAssetType) {
    const { from, asset, toAddress, amount, comment } = obj

    return new Promise(async (resolve, reject) => {
      let lock = () => {}

      if (this.props.isEncrypted) {
        try {
          lock = await unlockWallet()
        } catch(err) {
          return reject(err)
        }
      }

      try {
        await this.props.sendAssetForm({
          fromAlias: from,
          toAlias: toAddress,
          assetId: asset,
          amount,
          comment
        })
      } catch (err) {
        lock()
        return reject(err)
      }

      lock()
      resolve()
    })
  }

  sendSys(obj: sendSysType) {
    return new Promise(async (resolve, reject) => {
      let lock = () => {}

      if (this.props.isEncrypted) {
        try {
          lock = await unlockWallet()
        } catch(err) {
          return reject(err)
        }
      }
      
      try {
        await this.props.sendSysForm(obj)
      } catch (err) {
        return reject(err)
      }

      lock()
      resolve()
    })
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
    } catch (err) {
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

  onChangeForm(obj: Object, type: string) {
    if (type === 'asset') {
      this.props.editSendAsset(obj)
    } else if (type === 'sys') {
      this.props.editSendSys(obj)
    }
  }

  render() {
    return (
      <Send
        balance={this.props.balance}
        assetsFromAliasIsLoading={this.state.assetsFromAliasIsLoading}
        aliases={this.props.aliases.map(i => i.alias || i.address)}
        sendAsset={this.sendAsset.bind(this)}
        sendSys={this.sendSys.bind(this)}
        getAssetsFromAlias={this.getAssetsFromAlias.bind(this)}
        assets={this.state.assetsFromAlias}
        assetsForm={this.props.assetForm}
        sysForm={this.props.sysForm}
        onChangeForm={this.onChangeForm.bind(this)}
      />
    )
  }
}

const mapStateToProps = state => ({
  balance: state.wallet.getinfo.balance,
  aliases: state.wallet.aliases,
  assets: state.options.guids,
  assetForm: state.forms.sendAsset,
  sysForm: state.forms.sendSys,
  isEncrypted: state.wallet.isEncrypted
})

const mapDispatchToProps = dispatch => bindActionCreators({
  editSendAsset,
  editSendSys,
  sendAssetForm,
  sendSysForm
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(SendContainer)
