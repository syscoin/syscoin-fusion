// @flow
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Send from 'fw-components/Send'
import {
  editSendAsset,
  editSendSys,
  sendAssetForm,
  sendSysForm,
  getAssetsFromAlias
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
  isEncrypted: boolean,
  getAssetsFromAlias: Function
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

class SendContainer extends Component<Props> {

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

  async getAssetsFromAlias(alias: string) {
    this.props.getAssetsFromAlias({ receiver_address: alias })
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
        aliases={this.props.aliases.map(i => i.alias || i.address)}
        sendAsset={this.sendAsset.bind(this)}
        sendSys={this.sendSys.bind(this)}
        getAssetsFromAlias={this.getAssetsFromAlias.bind(this)}
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
  sendSysForm,
  getAssetsFromAlias
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(SendContainer)
