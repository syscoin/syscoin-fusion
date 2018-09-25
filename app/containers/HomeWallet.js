// @flow
import React, { Component } from 'react'
import { connect } from 'react-redux'
import Wallet from '../components/Wallet/Main'
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

const mapStateToProps = () => ({})

export default connect(mapStateToProps)(WalletHome)
