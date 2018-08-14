// @flow
import React, { Component } from 'react'
import { connect } from 'react-redux'
import Wallet from '../components/Wallet/Main'
import {
  currentSysAddress,
  currentBalance,
  getAliases,
  getAssetInfo,
  getPrivateKey,
  createNewAlias,
  getInfo,
  exportWallet,
  importWallet
} from '../utils/sys-helpers'
import {
  getTransactionsForAlias
} from '../utils/api-calls'
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
        createNewAlias={createNewAlias}
        currentSysAddress={currentSysAddress}
        currentBalance={currentBalance}
        getAliases={getAliases}
        getAssetInfo={getAssetInfo}
        getInfo={getInfo}
        getTransactionsForAlias={getTransactionsForAlias}
        getUnfinishedAliases={getUnfinishedAliases}
        getPrivateKey={getPrivateKey}
        importWallet={importWallet}
        exportWallet={exportWallet}
        incRoundToAlias={incRoundToAlias}
        pushNewAlias={pushNewAlias}
        removeFinishedAlias={removeFinishedAlias}
      />
    )
  }
}

const mapStateToProps = () => ({})

export default connect(mapStateToProps)(WalletHome)
