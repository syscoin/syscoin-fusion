// @flow
import React, { Component } from 'react'
import { Row, Col, Input } from 'antd'
import {
  getAssetInfo
} from '../../../utils/sys-helpers'

const Searcher = Input.Search

console.log(process.env)

type Props = {
  currentAddress: string,
  currentBalance: string,
  currentAliases: Array<any>,
  getTransactionsForAlias: Function
};
type State = {
  selectedAlias: string,
  checkAliasResult: any,
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
      checkAliasResult: null,
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
              <tr>
                <th width='200px'>Sender</th>
                <th width='200px'>Receiver</th>
                <th width='200px'>Amount</th>
                <th width='200px'>Symbol</th>
                <th width='200px'>Asset</th>
                <th width='200px'>Balance</th>
              </tr>
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
            </table>
          </Col>
        </Row>
      </div>
    )
  }

  checkAssetId(val: string) {
    getAssetInfo({
      assetId: val,
      aliasName: this.state.selectedAlias
    }, (err, info) => {
      if (err) {
        this.setState({
          checkAliasResult: 'No asset found with that ID'
        })
        return false
      }

      this.setState({
        checkAliasResult: info
      })
    })
  }

  updateSelectedAlias(alias: string) {
    this.setState({
      selectedAlias: alias,
      transactions: {
        isLoading: true,
        data: []
      }
    }, () => {
      this.getAliasTransactions(alias)
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

  generateAssetSearcher() {
    return (
      <Row>
        <Col xs={6} offset={9}>
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ color: 'white' }}>Asset checker</h3>
            <p>{this.state.selectedAlias.length ? `Selected alias: ${this.state.selectedAlias}` : 'No alias selected.'}</p>
            {this.state.selectedAlias.length ? (
              <Searcher
                enterButton='Search'
                name='assetUid'
                onSearch={this.checkAssetId.bind(this)}
                onChange={() => this.setState({ checkAliasResult: null })}
                placeholder='Insert your Asset ID'
              />
            ) : null}

            {this.state.checkAliasResult ? this.renderAliasResult(this.state.checkAliasResult) : null}
          </div>
        </Col>
      </Row>
    )
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
          {this.state.transactions.isLoading ? <h3>Loading transactions</h3> : this.generateTransactions()}
        </Col>
      </Row>
    )
  }
}
