// @flow
import React, { Component } from 'react'
import { Row, Col, Tabs } from 'antd'
import Accounts from './Accounts'
import Send from './Send'

const Tab = Tabs.TabPane

type Props = {
};

type State = {
  aliases: Array<Object>,
  address: string,
  balance: string
}

export default class Wallet extends Component<Props, State> {
  props: Props

  constructor(props) {
    super(props)

    this.state = {
      aliases: [],
      address: '',
      balance: ''
    }
  }

  componentWillMount() {
    this.updateWallet()
    setInterval(() => {
      this.updateWallet()
    }, 5000)
  }

  updateWallet() {
    this.getAliases()
    this.getCurrentAddress()
    this.getCurrentBalance()
  }

  getCurrentAddress() {
    this.props.currentSysAddress((err, address) => {
      this.setState({
        address
      })
    })
  }

  getCurrentBalance() {
    this.props.currentBalance((err, balance) => {
      this.setState({
        balance
      })
    })
  }

  getAliases() {
    this.props.getAliases((err, aliases) => {
      this.setState({
        aliases
      })
    })
  }

  generateCurrentAliasBalance() {
    return (
      <span style={{marginRight: 20}}>
        Balance: {this.state.aliases.filter(i => i.alias).map(i => i.balance).reduce((prev, next) => (next + prev), 0)} SYS
      </span>
    )
  }

  render() {
    return (
      <Row>
        <Col xs={24}>
          <Tabs className='tabs-app' tabBarExtraContent={this.generateCurrentAliasBalance()}>
            <Tab tab='Accounts' key='1'>
              <Accounts
                currentAliases={this.state.aliases || []}
                currentBalance={this.state.balance || ''}
                currentAddress={this.state.address || ''}
                getTransactionsForAlias={this.props.getTransactionsForAlias}
                updateWallet={this.updateWallet.bind(this)}
              />
            </Tab>
            <Tab tab='Send' key='2'>
              <Send
                currentAliases={this.state.aliases || []}
                currentBalance={this.state.balance || ''}
                updateWallet={this.updateWallet.bind(this)}
              />
            </Tab>
          </Tabs>
        </Col>
      </Row>
    )
  }
}
