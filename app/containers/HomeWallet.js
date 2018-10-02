// @flow
import React, { Component  } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Wallet from '../components/Wallet/Main'
import { saveGetInfo } from 'fw-actions/wallet'
import {
  aliasInfo,
  currentSysAddress,
  currentBalance,
  editAlias,
  getAliases,
  getAssetInfo,
  getAssetAllocationInfo,
  getPrivateKey,
  createNewAlias,
  getInfo,
  exportWallet,
  importWallet,
  getTransactionsPerAsset
} from '../utils/sys-helpers'
import {
  getUnfinishedAliases,
  pushNewAlias,
  removeFinishedAlias,
  incRoundToAlias
} from '../utils/new-alias-manager'

type Props = {};

class WalletHome extends Component<Props> {
  props: Props;

  componentDidMount() {
    if (!window.updateWallet) {
      window.updateWallet = setInterval(() => this.updateWallet(), 10000)
    }

    this.updateWallet()
  }

  updateWallet() {
    this.props.saveGetInfo()
  }

  render() {
    return (
      <Wallet
        aliasInfo={aliasInfo}
        createNewAlias={createNewAlias}
        currentSysAddress={currentSysAddress}
        currentBalance={currentBalance}
        editAlias={editAlias}
        getAliases={getAliases}
        getAssetInfo={getAssetInfo}
        getAssetAllocationInfo={getAssetAllocationInfo}
        getInfo={getInfo}
        getUnfinishedAliases={getUnfinishedAliases}
        getPrivateKey={getPrivateKey}
        importWallet={importWallet}
        exportWallet={exportWallet}
        incRoundToAlias={incRoundToAlias}
        pushNewAlias={pushNewAlias}
        removeFinishedAlias={removeFinishedAlias}
        getTransactionsPerAsset={getTransactionsPerAsset}
      />
    )
  }
}

const mapStateToProps = state => ({
  wallet: state.wallet
})

const mapDispatchToProps = dispatch => bindActionCreators({
  saveGetInfo
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(WalletHome)
