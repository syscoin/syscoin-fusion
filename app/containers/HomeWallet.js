// @flow
import React, { Component } from 'react'
import { connect } from 'react-redux'
import Wallet from '../components/Wallet/Main'
import {
  currentSysAddress,
  currentBalance,
  getAliases,
  getAssetInfo
} from '../utils/sys-helpers'
import {
  getTransactionsForAlias
} from '../utils/api-calls'

type Props = {};

class WalletHome extends Component<Props> {
  props: Props;

  render() {
    return (
      <Wallet
        currentSysAddress={currentSysAddress}
        currentBalance={currentBalance}
        getAliases={getAliases}
        getAssetInfo={getAssetInfo}
        getTransactionsForAlias={getTransactionsForAlias}
      />
    )
  }
}

const mapStateToProps = () => ({})

export default connect(mapStateToProps)(WalletHome)
