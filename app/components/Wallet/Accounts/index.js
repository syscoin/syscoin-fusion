// @flow
import React, { Component } from 'react'
import { Row, Col } from 'antd'

type Props = {
  currentAddress: string,
  currentBalance: string,
  currentAliases: Array<any>,
  getTransactionsForAlias: Function
};
type State = {
  selectedAlias: string,
  aliasAssets: {
    isLoading: boolean,
    data: Array<any>
  },
  transactions: {
    isLoading: boolean,
    data: Array<any>
  }
};

export default class Accounts extends Component<Props, State> {
  props: Props;

  constructor(props: Props) {
    super(props)

    this.state = {
      selectedAlias: '',
      aliasAssets: {
        isLoading: false,
        data: []
      },
      transactions: {
        isLoading: false,
        data: []
      }
    }
  }

  generateAliasesBoxes() {
    return this.props.currentAliases.filter(i => i.alias).map((i, key) => (
      <Row className='alias-box' key={key} onClick={() => this.updateSelectedAlias(i.alias)}>
        <Col xs={4} offset={7}>
          <img className='alias-img' src={`https://api.adorable.io/avatars/125/${i.address}@ert.io`} alt='Alias' />
        </Col>
        <Col xs={6} className='text-col'>
          <div className='alias-name'>{i.alias || 'Unnamed alias'}</div>
          <div className='alias-balance'>{i.balance} SYS</div>
          <div className='alias-address'>{i.address}</div>
        </Col>
      </Row>
    ))
  }

  getOwnAliasBalance(obj: Object) {
    if (obj.sender === this.state.selectedAlias) {
      return obj.sender_balance
    } else if (obj.receiver === this.state.selectedAlias) {
      return obj.receiver_balance
    } else if (obj.receiver === obj.sender) {
      return obj.amount
    }

    return 0
  }

  generateTransactions() {
    return (
      <div>
        <h3>Transactions for alias: {this.state.selectedAlias}</h3>
        <Row>
          <Col xs={12} offset={7} className='text-col'>
            <table>
              <thead>
                <tr>
                  <th width='200px'>Sender</th>
                  <th width='200px'>Receiver</th>
                  <th width='200px'>Amount</th>
                  <th width='200px'>Symbol</th>
                  <th width='200px'>Asset</th>
                  <th width='200px'>Balance</th>
                </tr>
              </thead>
              <tbody>
                {this.state.transactions.data.map((i, key) => (
                  <tr key={key}>
                    <td width='200px'>{i.sender}</td>
                    <td width='200px'>{i.receiver}</td>
                    <td width='200px'>{i.amount}</td>
                    <td width='200px'>{i.symbol}</td>
                    <td width='200px'>{i.asset}</td>
                    <td width='200px'>{this.getOwnAliasBalance(i)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Col>
        </Row>
      </div>
    )
  }

  generateAliasAssets() {
    return (
      <div>
        <h3>Assets for alias: {this.state.selectedAlias}</h3>
        <Row>
          <Col xs={12} offset={7} className='text-col'>
            <table>
              <thead>
                <tr>
                  <th width='200px'>Symbol</th>
                  <th width='200px'>ID</th>
                  <th width='200px'>Amount</th>
                </tr>
              </thead>
              <tbody>
                {this.state.aliasAssets.data.map((i, key) => (
                  <tr key={key}>
                    <td width='200px'>{i.symbol}</td>
                    <td width='200px'>{i.asset}</td>
                    <td width='200px'>{i.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Col>
        </Row>
      </div>
    )
  }

  updateSelectedAlias(alias: string) {
    this.setState({
      selectedAlias: alias,
      aliasAssets: {
        isLoading: true,
        data: []
      },
      transactions: {
        isLoading: true,
        data: []
      }
    }, () => {
      this.getAliasTransactions(alias)
      this.getAliasAssets(alias)
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

  getAliasTransactions(alias: string) {
    this.props.getTransactionsForAlias(alias).then(res => this.setState({
      transactions: {
        isLoading: false,
        data: res.data
      }
    })).catch(err => console.log(err))
  }

  getAliasAssets(alias: string) {
    this.props.getTransactionsForAlias(alias).then(res => {
      const assets = {}

      res.data.forEach(i => {
        if (!Object.keys(assets).find(x => x === i.symbol)) {
          assets[i.symbol] = {
            symbol: i.symbol,
            asset: i.asset,
            amount: 0
          }
        }
      })

      res.data.forEach(i => {
        if (i.sender === i.receiver) {
          assets[i.symbol].amount += parseFloat(i.amount)
          return
        }

        if (i.sender === alias) {
          assets[i.symbol].amount -= parseFloat(i.amount)
        } else if (i.receiver === alias) {
          assets[i.symbol].amount += parseFloat(i.amount)
        }
      })

      return this.setState({
        aliasAssets: {
          isLoading: false,
          data: Object.keys(assets).map(i => ({
            symbol: i,
            asset: assets[i].asset,
            amount: assets[i].amount
          }))
        }
      })
    }).catch(err => console.log(err))
  }

  render() {
    return (
      <Row>
        <Col
          xs={24}
          style={{
            textAlign: 'center'
          }}
        >
          <p>This is your current address:</p>
          <p>{this.props.currentAddress}</p>
          <p>Current balance:</p>
          <p>{this.props.currentBalance}</p>
          <p>Your aliases:</p>
          {this.generateAliasesBoxes()}
          {this.state.aliasAssets.isLoading ? <h3>Loading Assets</h3> : this.generateAliasAssets()}
          {this.state.transactions.isLoading ? <h3>Loading transactions</h3> : this.generateTransactions()}
        </Col>
      </Row>
    )
  }
}
