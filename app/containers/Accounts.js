// @flow
import React, { Component } from 'react'
import swal from 'sweetalert'
import map from 'async/map'

import Accounts from 'fw-components/Wallet/Accounts/'
import {
  currentBalance,
  getAliases,
  getAssetInfo,
  getAssetAllocationInfo,
  getTransactionsPerAsset
} from 'fw-sys'

type Props = {};
type State = {
  selectedAlias: string,
  aliasAssets: {
    selected: '',
    isLoading: boolean,
    data: Array<any>,
    error: boolean
  },
  transactions: {
    isLoading: boolean,
    data: Array<any>,
    error: boolean
  },
  aliases: Array<Object>,
  balance: string
};

export default class AccountsContainer extends Component<Props, State> {

  constructor(props) {
    super(props)

    this.updateSelectedAlias = this.updateSelectedAlias.bind(this)
    this.getAssetsInfo = this.getAssetsInfo.bind(this)
    this.selectAsset = this.selectAsset.bind(this)

    this.initialState = {
      selectedAlias: '',
      aliasAssets: {
        selected: '',
        isLoading: false,
        data: [],
        error: false
      },
      transactions: {
        isLoading: false,
        data: [],
        error: false
      },
      aliases: [],
      balance: ''
    }

    this.state = {
      ...this.initialState
    }
  }

  componentWillMount() {
    this.updateAccountsTab()
    if (!window.AccountsUpdate) {
      window.AccountsUpdate = setInterval(() => {
        this.updateAccountsTab()
      }, 10000)
    }
  }

  componentWillUnmount() {
    clearInterval(window.AccountsUpdate)
  }

  updateAccountsTab() {
    this.getBalance()
    this.getAliases()
  }

  async getBalance() {
    try {
      this.setState({
        balance: await currentBalance()
      })
    } catch(err) {
      this.setState({
        balance: '0.00'
      })
    }
  }

  async getAliases() {
    try {
      this.setState({
        aliases: await getAliases()
      })
    } catch(err) {
      this.setState({
        aliases: []
      })
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
        isLoading: true,
        data: [],
        error: false
      },
      transactions: {
        isLoading: true,
        data: [],
        error: false
      }
    }, () => {
      this.getAssetsInfo(alias)
    })
  }

  getAssetsInfo(alias: string) {
    getAssetAllocationInfo(alias, (err, result) => {
      if (err) {
        if (err === 'NO_ASSET_SELECTED') {
          this.setState({
            ...this.initialState
          })
          return swal('No asset selected', 'Add some in Fusion/fusion.cfg file located in your Documents folder', 'warning')
        }
        return swal('Error', 'Something went wrong', 'error')
      }

      if (result.find(i => !i.symbol)) {
        // If alias/address doesnt own any token, fallback to assetinfo.
        return map(result, async (x, done) => {
          if (x.symbol) {
            return done(null, x)
          }

          let assetInfo

          try {
            assetInfo = await getAssetInfo(x.asset)
          } catch (assetInfoErr) {
            return done(assetInfoErr)
          }

          x.symbol = assetInfo.symbol
          x.balance = '0'
          return done(null, x)
        }, (error, finalResult) => {
          if (error) {
            this.setState({
              aliasAssets: {
                selected: '',
                data: [],
                isLoading: false,
                error: true
              }
            })
            return swal('Error', 'Something went wrong', 'error')
          }

          this.setState({
            aliasAssets: {
              selected: '',
              data: finalResult,
              isLoading: false,
              error: false
            }
          })
        })
      }

      this.setState({
        aliasAssets: {
          selected: '',
          data: result,
          isLoading: false,
          error: false
        }
      })
    })
  }

  selectAsset(asset) {
    this.setState({
      aliasAssets: {
        ...this.state.aliasAssets,
        selected: asset,
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

  render() {
    const { balance, aliases, transactions, selectedAlias, aliasAssets } = this.state
    return (
      <Accounts
        balance={balance}
        aliases={aliases}
        transactions={transactions}
        selectedAlias={selectedAlias}
        aliasAssets={aliasAssets}
        updateSelectedAlias={this.updateSelectedAlias}
      />
    )
  }
}
