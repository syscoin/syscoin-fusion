// @flow
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withNamespaces } from 'react-i18next'
import swal from 'sweetalert'

import Accounts from 'fw-components/Accounts/'

import {
  getTransactionsPerAsset,
  listAssetAllocation,
  getPrivateKey,
  claimAssetInterest
} from 'fw-sys'
import { dashboardAssets, dashboardTransactions } from 'fw-actions/wallet'
import { editSendAsset, getAssetsFromAlias } from 'fw-actions/forms'
import parseError from 'fw-utils/error-parser'
import SyscoinLogo from 'fw/syscoin-logo.png'
import unlockWallet from 'fw-utils/unlock-wallet'

type Props = {
  balance: number,
  aliases: Array<Object>,
  assets: Array<Object>,
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
    const { assets } = this.props
    let results

    try {
      results = await listAssetAllocation({
        receiver_address: alias
      }, assets.map(i => i._id))
    } catch(err) {
      return swal('Error', parseError(err.message), 'error')
    }

    if (!results.length && !assets.length) {
      this.setState({
        aliasAssets: {
          selected: '',
          selectedSymbol: '',
          data: [],
          isLoading: false,
          error: false
        },
        selectedAlias: ''
      })
      return swal('No asset detected', 'The wallet hasn\'t detected any asset. This might happen by not being fully synchronized. You can also add some specific assets in your fusion.cfg file located in Documents/Fusion folder', 'warning')
    } else if (!results.length && assets.length) {
      results = assets.map(i => ({
        asset: i._id,
        balance: '0.00000000',
        symbol: i.symbol
      }))
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
    const { asset, symbol } = obj
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
          alias: this.state.selectedAlias,
          assetId: asset
        })
      } catch(err) {
        this.setState({
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
    const { currentBlock, headBlock } = this.props

    if (headBlock === 0) {
      return 0
    }

    return parseInt((currentBlock / headBlock) * 100, 10)
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
    this.props.getAssetsFromAlias({ receiver_address: alias })
    this.props.changeTab('2')
  }

  goToSysForm() {
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

  render() {
    const { transactions, selectedAlias, aliasAssets } = this.state
    const { balance, aliases } = this.props

    return (
      <Accounts
        backgroundLogo={this.getBackgroundLogo()}
        syncPercentage={this.syncPercentage()}
        headBlock={this.props.headBlock}
        currentBlock={this.props.currentBlock}
        balance={balance}
        aliases={aliases}
        transactions={transactions}
        selectedAlias={selectedAlias}
        aliasAssets={aliasAssets}
        updateSelectedAlias={this.updateSelectedAlias.bind(this)}
        selectAsset={this.selectAsset.bind(this)}
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
        t={this.props.t}
      />
    )
  }
}

const mapStateToProps = state => ({
  balance: state.wallet.getinfo.balance,
  aliases: state.wallet.aliases,
  assets: state.options.guids,
  headBlock: state.wallet.blockchaininfo.headers,
  currentBlock: state.wallet.getinfo.blocks,
  dashboardSysTransactions: state.wallet.dashboard.transactions,
  dashboardAssetsBalances: state.wallet.dashboard.assets,
  isEncrypted: state.wallet.isEncrypted
})

const mapDispatchToProps = dispatch => bindActionCreators({
  dashboardAssets,
  dashboardTransactions,
  editSendAsset,
  getAssetsFromAlias
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(withNamespaces('translation')(AccountsContainer))
