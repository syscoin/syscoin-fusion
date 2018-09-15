// @flow
import React, { Component } from 'react'
import { Row, Col, Icon, Table, Spin } from 'antd'
import moment from 'moment'
import swal from 'sweetalert'
import map from 'async/map'
import SyscoinLogo from '../../../syscoin-logo.png'

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

    this.state = {
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
  }

  isAliasSelected(aliasInfo) {
    return aliasInfo.alias ? aliasInfo.alias === this.state.selectedAlias : aliasInfo.address === this.state.selectedAlias
  }

  generateAliasesBoxes() {
    return this.props.currentAliases.map((i, key) => (
      <Row className={`alias-box ${this.isAliasSelected(i) ? 'expanded' : 'non-expanded'} ${this.state.aliasAssets.isLoading ? 'loading' : ''}`} key={key} onClick={() => this.updateSelectedAlias(i.alias ? i.alias : i.address)}>
        <Col xs={this.isAliasSelected(i) ? 6 : 4} offset={this.isAliasSelected(i) ? 1 : 0} className='alias-img-container'>
          <img className='alias-img' src={`https://api.adorable.io/avatars/125/${i.address}@ert.io`} alt='Alias' />
        </Col>
        <Col xs={16} className='alias-text-container'>
          <div className={`alias-name ${this.isAliasSelected(i) ? 'trim' : ''}`}>{i.alias ? i.alias : i.address}</div>
          <div className='alias-type'>{i.alias ? 'Alias' : 'Address'}</div>
        </Col>
      </Row>
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

    keys.forEach((i, key) => result.push(
      <p key={key} style={{ fontSize: 15 }}>{i}: {info[i]}</p>
    ))

    return result
  }

  getAliasTransactions(obj: Object, cb) {
    const { asset, alias } = obj
    return this.props.getTransactionsForAlias({
      alias, asset
    })
  }

  generateAliasAssets() {
    return this.state.aliasAssets.data.map(i => (
      <Col
        xs={10}
        offset={1}
        className={`asset-box ${this.state.aliasAssets.selected === i.asset ? 'selected' : ''}`}
        key={i.asset}
        onClick={() => this.selectAsset(i.asset)}
      >
        <h3 className='asset-box-name'>{i.symbol}</h3>
        <h5 className='asset-box-guid'>{i.asset}</h5>
        <h4 className='asset-box-balance'>Balance: {Number(i.balance).toFixed(2)}</h4>
      </Col>
    ))
  }

  generateTransactionsTable() {
    const columns = [
      {
        title: ' ',
        key: 'symbol',
        dataIndex: 'symbol',
        render: (text, transaction) => (
          <Icon
            className={`arrow ${this.isIncoming(transaction) ? 'incoming' : 'outgoing'}`}
            type={`arrow-${this.isIncoming(transaction) ? 'down' : 'up'}`}
          />
        )
      },
      {
        title: 'From',
        key: 'sender',
        dataIndex: 'sender',
        render: text => <span>{text}</span>
      },
      {
        title: 'To',
        key: 'receiver',
        dataIndex: 'receiver',
        render: text => <span>{text}</span>
      },
      {
        title: 'Date',
        key: 'time',
        dataIndex: 'time',
        render: time => <span>{moment(time).format('DD-MM-YYYY HH:mm')}</span>
      },
      {
        title: 'Details',
        key: 'amount',
        dataIndex: 'amount',
        render: (amount, transaction) => ({
          children: <span className={`amount ${this.isIncoming(transaction) ? 'incoming' : 'outgoing'}`}>{this.isIncoming(transaction) ? '+' : '-'}{amount}</span>,
          props: {
            width: 200
          }
        })
      }
    ]

    let emptyText

    if (this.state.transactions.error) {
      emptyText = 'Something went wrong. Try again later'
    } else if (this.state.transactions.isLoading) {
      emptyText = 'Loading...'
    } else {
      emptyText = 'No data'
    }

    return (
      <Table
        dataSource={this.state.transactions.data.sort((a, b) => b.time - a.time)}
        columns={columns}
        className='transactions-table'
        rowClassName='transactions-table-row'
        pagination={{
          defaultPageSize: 10
        }}
        locale={{
          emptyText
        }}
      />
    )
  }

  isIncoming(transaction) {
    if (transaction.receiver === this.state.selectedAlias) {
      return true
    }

    return false
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
      })).catch(err => this.setState({
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
          <div className='balance-container'>
            <h4 className='your-balance-title'>
              Your balance
            </h4>
            <h2 className='your-balance-amount'>
              {Number(this.props.currentBalance).toFixed(2)} SYS
            </h2>
          </div>
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
