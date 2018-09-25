import React, { Component } from 'react'
import { Row, Col, Icon, Spin } from 'antd'
import swal from 'sweetalert'
import map from 'async/map'
import SyscoinLogo from '../../../syscoin-logo.png'
import AliasAddressItem from './components/alias-address-item'
import AssetBox from './components/asset-box'
import TransactionList from './components/transaction-list'
import UserBalance from './components/balance'

type Props = {
  currentBalance: string,
  currentAliases: Array<any>,
  fetchAssetInfo: Function,
  getAssetsInfo: Function,
  getTransactionsForAlias: Function
};
type State = {
  assetInfoBySelectedAlias: Array<Object>,
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
  }
};

export default class Accounts extends Component<Props, State> {
  props: Props;

  constructor(props: Props) {
    super(props)

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
      }
    }

    this.state = {
      ...this.initialState
    }
  }

  isAliasSelected(aliasInfo: Object) {
    return aliasInfo.alias ? aliasInfo.alias === this.state.selectedAlias : aliasInfo.address === this.state.selectedAlias
  }

  generateAliasesBoxes() {
    const aliases = []
    const addresses = []
    
    this.props.currentAliases.forEach(i => {
      // Separating aliases and addresses for later ordering
      // Using of sort method would result in unpredictable result and kinda complex ordering logic
      if (i.alias) {
        return aliases.push(i)
      }

      return addresses.push(i)
    })
    
    return aliases.concat(addresses).map((i) => (
      <AliasAddressItem
        key={i.address}
        alias={i.alias}
        address={i.address}
        isLoading={this.state.aliasAssets.isLoading}
        isSelected={this.isAliasSelected(i)}
        updateSelectedAlias={this.updateSelectedAlias.bind(this)}
      />
    ))
  }

  getOwnAliasBalance(obj: Object) {
    if (obj.receiver === obj.sender) {
      return obj.amount
    }

    if (obj.sender === this.state.selectedAlias) {
      return obj.sender_balance
    } else if (obj.receiver === this.state.selectedAlias) {
      return obj.receiver_balance
    }

    return 0
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
    this.props.getAssetsInfo(alias, (err, result) => {
      if (err) {
        if (err === 'NO_ASSET_SELECTED') {
          this.setState({
            ...this.initialState
          })
          return swal('No asset selected', 'Add some in Fusion/fusion.cfg file located in your Documents folder', 'warning')
        } else if (err === 'DONT_HAVE_ASSET') {
          return this.setState({
            aliasAssets: {
              selected: '',
              data: [],
              isLoading: false,
              error: false
            }
          })
        }
        return swal('Error', 'Something went wrong', 'error')
      }

      if (result.find(i => !i.symbol)) {
        return map(result, (x, done) => {
          if (x.symbol) {
            return done(null, x)
          }

          this.props.fetchAssetInfo({
            asset: x.asset
          }).then(res => {
            if (res.data.length) {
              x.symbol = res.data[0].symbol
              return done(null, x)
            }

            x.not_exists = true
            return done(null, x)

          }).catch(fetchErr => done(fetchErr))
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
              data: finalResult.filter(x => !x.not_exists),
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

  renderAliasResult(info: Object | string) {
    if (typeof info === 'string') {
      return info
    }

    const result = []
    const keys = Object.keys(info)

    keys.forEach(i => result.push(
      <p key={i} style={{ fontSize: 15 }}>{i}: {info[i]}</p>
    ))

    return result
  }

  getAliasTransactions(obj: Object) {
    const { asset, alias } = obj
    return this.props.getTransactionsForAlias({
      alias, asset
    })
  }

  generateAliasAssets() {
    return this.state.aliasAssets.data.map(i => (
      <AssetBox
        isSelected={this.state.aliasAssets.selected === i.asset}
        selectAsset={this.selectAsset.bind(this)}
        asset={i.asset}
        balance={i.balance}
        symbol={i.symbol}
        key={i.asset}
      />
    ))
  }

  generateTransactionsTable() {
    return (
      <TransactionList
        data={this.state.transactions.data}
        error={this.state.transactions.error}
        isLoading={this.state.transactions.isLoading}
        selectedAlias={this.state.transactions.selectedAlias}
      />
    )
  }

  selectAsset(asset) {
    this.setState({
      aliasAssets: {
        ...this.state.aliasAssets,
        selected: asset,
        error: false
      },
      transactions: {
        ...this.state.transactions,
        isLoading: true,
        error: false
      }
    }, () => {

      this.props.getTransactionsForAlias({
        alias: this.state.selectedAlias,
        asset
      }).then(res => this.setState({
        transactions: {
          isLoading: false,
          data: res.data,
          error: false
        }
      })).catch(() => this.setState({
        transactions: {
          data: [],
          isLoading: false,
          error: true
        }
      }))

    })
  }

  render() {
    return (
      <Row className='accounts-container'>
        <Col xs={9} className='accounts-container-left'>
          <UserBalance
            currentBalance={this.props.currentBalance}
          />
          <hr className='alias-separator' />
          <h4 className='your-aliases-text'>Your aliases/addresses</h4>
          <div className='aliases-container'>
            {this.generateAliasesBoxes()}
          </div>
        </Col>
        <Col xs={15} className='accounts-container-right'>
          {(!this.state.selectedAlias || this.state.aliasAssets.error) ? <img src={SyscoinLogo} alt='sys-logo' width='320' height='200' className='sys-logo-bg' /> : null}
          {this.state.aliasAssets.data.length ? (
            <div>
              <Row className='asset-box-container'>
                <h4 className='asset-box-text'>Available assets</h4>
                {this.generateAliasAssets()}
              </Row>
            </div>
          ) : null}
          <Row>
            <Col offset={1} xs={21}>
              {this.state.aliasAssets.selected ? (
                <div>
                  <h4 className='transactions-table-title'>Transactions</h4>
                  {this.generateTransactionsTable()}
                </div>
              ) : null}
            </Col>
          </Row>
          {this.state.aliasAssets.isLoading && 
            <div className='loading-container'>
              <Spin indicator={<Icon type='loading' spin />} />
            </div>
          }
        </Col>
      </Row>
    )
  }
}
