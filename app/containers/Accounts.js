// @flow
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withNamespaces } from 'react-i18next'
import swal from 'sweetalert'

import Accounts from 'fw-components/Accounts/'

import {
  getTransactionsPerAsset,
  getAssetBalancesByAddress,
  getPrivateKey,
  claimAssetInterest,
  aliasInfo,
  getNewAddress,
  editLabel
} from 'fw-sys'
import { dashboardAssets, dashboardTransactions } from 'fw-actions/wallet'
import { editSendAsset, getAssetsFromAlias, sendChangeTab } from 'fw-actions/forms'
import parseError from 'fw-utils/error-parser'
import SyscoinLogo from 'fw/syscoin-logo.png'
import unlockWallet from 'fw-utils/unlock-wallet'

type Props = {
  balance: obj,
  aliases: Array<Object>,
  headBlock: number,
  currentBlock: number,
  dashboardSysTransactions: {
    isLoading: boolean,
    error: boolean,
    data: Array<Object>
  },
  dashboardAssetsBalances: {
    isLoading: boolean,
    error: boolean,
    data: Array<Object>
  },
  dashboardAssets: Function,
  dashboardTransactions: Function,
  changeTab: Function,
  editSendAsset: Function,
  isEncrypted: boolean,
  getAssetsFromAlias: Function,
  sendChangeTab: Function,
  verificationProgressSync: number,
  t: Function
};

type State = {
  selectedAlias: string,
  aliasAssets: {
    selected: string,
    selectedSymbol: string,
    isLoading: boolean,
    data: Array<any>,
    error: boolean
  },
  transactions: {
    isLoading: boolean,
    data: Array<any>,
    error: boolean
  }
};

type selectAssetType = {
  asset: string,
  symbol: string
};

class AccountsContainer extends Component<Props, State> {
  initialState: State

  constructor(props: Props) {
    super(props)

    this.initialState = {
      selectedAlias: '',
      aliasAssets: {
        selected: '',
        selectedSymbol: '',
        isLoading: false,
        data: [],
        error: false
      },
      transactions: {
        isLoading: false,
        data: [],
        error: false
      },
      aliases: []
    }

    this.state = {
      ...this.initialState
    }
  }

  getSnapshotBeforeUpdate(prevProps) {
    if (!prevProps.aliases.length && this.props.aliases.length) {
      this.props.dashboardAssets()
    }
    return null
  }

  updateSelectedAlias(alias: string) {
    if (this.state.aliasAssets.isLoading) {
      return false
    }
    
    this.setState({
      selectedAlias: alias,
      aliasAssets: {
        selected: '',
        selectedSymbol: '',
        isLoading: true,
        data: [],
        error: false
      },
      transactions: {
        isLoading: false,
        data: [],
        error: false
      }
    }, () => {
      this.getAssetsInfo(alias)
    })
  }

  async getAssetsInfo(alias: string) {
    const { t, limitToAssets } = this.props
    let results

    try {
      results = await getAssetBalancesByAddress(alias)
    } catch(err) {
      this.setState({
        aliasAssets: {
          ...this.state.aliasAssets,
          selectedSymbol: '',
          isLoading: false
        }
      })
      return swal(t('misc.error'), parseError(err.message), 'error')
    }

    if (limitToAssets.length) {
      results = results.filter(i => limitToAssets.indexOf(i.asset_guid) !== -1)
    }

    this.setState({
      aliasAssets: {
        selected: '',
        selectedSymbol: '',
        data: results,
        isLoading: false,
        error: false
      }
    })
  }

  selectAsset(obj: selectAssetType) {
    const { asset, symbol, page = 0 } = obj
    this.setState({
      aliasAssets: {
        ...this.state.aliasAssets,
        selected: asset,
        selectedSymbol: symbol,
        error: false
      },
      transactions: {
        ...this.initialState.transactions,
        isLoading: true
      }
    }, async () => {

      let transactions
      try {
        transactions = await getTransactionsPerAsset({
          address: this.state.selectedAlias,
          asset,
          page
        })
      } catch(err) {
        return this.setState({
          transactions: {
            data: [],
            isLoading: false,
            error: true
          }
        })
      }
      
      this.setState({
        transactions: {
          isLoading: false,
          data: transactions,
          error: false
        }
      })
    })
  }

  syncPercentage() {
    const { headBlock, verificationProgressSync } = this.props

    if (headBlock === 0) {
      return 0
    }

    const percentage = (verificationProgressSync * 100).toFixed(2)
    return parseFloat(percentage)
  }

  getBackgroundLogo() {
    const bgLogo = global.appStorage.get('background_logo')

    if (bgLogo) {
      return bgLogo
    }

    return SyscoinLogo
  }

  async getPrivateKey(address: string, cb: Function) {
    let lock = () => {}
    let key

    if (this.props.isEncrypted) {
      try {
        lock = await unlockWallet()
      } catch(err) {
        return cb(err)
      }
    }
  
    try {
      key = await getPrivateKey(address)
    } catch (err) {
      lock()
      return cb(err)
    }

    lock()
    cb(null, key)
  }

  goToHome() {
    this.setState({
      ...this.initialState
    })
  }

  goToAssetForm(asset: string, alias: string) {
    this.props.editSendAsset({
      from: alias,
      asset,
      toAddress: '',
      amount: '',
      comment: ''
    })
    this.props.getAssetsFromAlias(alias)
    this.props.changeTab('2')
  }

  goToSysForm() {
    this.props.sendChangeTab('sys')
    this.props.changeTab('2')
  }

  claimAssetInterest(asset, alias) {
    return new Promise(async (resolve, reject) => {
      try {
        await claimAssetInterest(asset, alias)
      } catch(err) {
        return reject(err)
      }

      resolve(true)
    })
  }

  claimAllFromAsset(asset, fromAliases) {
    return new Promise(async (resolve, reject) => {
      const aliases = fromAliases || this.props.aliases.map(i => i.alias || i.address)
      let results = aliases.map(i => this.claimAssetInterest(asset, i))

      try {
        results = await Promise.all(results)
      } catch(err) {
        return reject(err)
      }

      const wasSuccess = results.find(i => typeof i === 'boolean')

      if (wasSuccess) {
        return resolve()
      }

      return reject()
    })
  }

  async getAliasInfo(alias: name) {
    // eslint-disable-next-line no-return-await
    return await aliasInfo(alias)
  }

  render() {
    const { transactions, selectedAlias, aliasAssets } = this.state
    const { aliases, balance } = this.props
    return (
      <Accounts
        backgroundLogo={this.getBackgroundLogo()}
        syncPercentage={this.syncPercentage()}
        headBlock={this.props.headBlock}
        currentBlock={this.props.currentBlock}
        editLabel={editLabel}
        balance={balance}
        aliases={aliases}
        transactions={transactions}
        selectedAlias={selectedAlias}
        aliasAssets={aliasAssets}
        updateSelectedAlias={this.updateSelectedAlias.bind(this)}
        selectAsset={this.selectAsset.bind(this)}
        getAliasInfo={this.getAliasInfo}
        getNewAddress={getNewAddress}
        getPrivateKey={this.getPrivateKey.bind(this)}
        goToHome={this.goToHome.bind(this)}
        dashboardSysTransactions={this.props.dashboardSysTransactions}
        dashboardAssets={this.props.dashboardAssetsBalances}
        getDashboardAssets={this.props.dashboardAssets}
        getDashboardTransactions={this.props.dashboardTransactions}
        goToAssetForm={this.goToAssetForm.bind(this)}
        goToSysForm={this.goToSysForm.bind(this)}
        claimInterest={this.claimAssetInterest}
        claimAllInterestFromAsset={this.claimAllFromAsset.bind(this)}
        sendChangeTab={this.props.sendChangeTab}
        t={this.props.t}
      />
    )
  }
}

const mapStateToProps = state => ({
  balance: state.wallet.balance,
  aliases: state.wallet.aliases,
  limitToAssets: state.options.guids.map(i => i.asset_guid),
  headBlock: state.wallet.blockchaininfo.headers,
  currentBlock: state.wallet.blockchaininfo.blocks,
  dashboardSysTransactions: state.wallet.dashboard.transactions,
  dashboardAssetsBalances: state.wallet.dashboard.assets,
  isEncrypted: state.wallet.isEncrypted,
  verificationProgressSync: state.wallet.blockchaininfo.verificationprogress
})

const mapDispatchToProps = dispatch => bindActionCreators({
  dashboardAssets,
  dashboardTransactions,
  editSendAsset,
  getAssetsFromAlias,
  sendChangeTab
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(withNamespaces('translation')(AccountsContainer))
