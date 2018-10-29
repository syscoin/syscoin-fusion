// @flow
import React, { Component } from 'react'
import { connect } from 'react-redux'
import swal from 'sweetalert'

import Accounts from 'fw-components/Accounts/'
import {
  getTransactionsPerAsset,
  listAssetAllocation,
  getPrivateKey
} from 'fw-sys'
import parseError from 'fw-utils/error-parser'
import SyscoinLogo from 'fw/syscoin-logo.png'

type Props = {
  balance: number,
  aliases: Array<Object>,
  assets: Array<Object>,
  headBlock: number,
  currentBlock: number
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
    try {
      return cb(null, await getPrivateKey(address))
    } catch (err) {
      return cb(err)
    }
  }

  goToHome() {
    this.setState({
      ...this.initialState
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
        getPrivateKey={this.getPrivateKey}
        goToHome={this.goToHome.bind(this)}
      />
    )
  }
}

const mapStateToProps = state => ({
  balance: state.wallet.getinfo.balance,
  aliases: state.wallet.aliases,
  assets: state.options.guids,
  headBlock: state.wallet.blockchaininfo.headers,
  currentBlock: state.wallet.getinfo.blocks
})

export default connect(mapStateToProps)(AccountsContainer)
