// @flow
import React, { Component } from 'react'
import { Row, Col, Tabs } from 'antd'
import Accounts from './Accounts'
import Send from './Send'
import Tools from './Tools'

const Tab = Tabs.TabPane

type Props = {
  currentSysAddress: Function,
  currentBalance: Function,
  getAliases: Function,
  getAssetInfo: Function,
  getInfo: Function,
  getTransactionsForAlias: Function,
  getUnfinishedAliases: Function,
  incRoundToAlias: Function,
  pushNewAlias: Function,
  removeFinishedAlias: Function,
  createNewAlias: Function
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

    if (!global.updateWalletInterval) {
      global.updateWalletInterval = setInterval(() => {
        this.updateWallet()
      }, 10000)
    }

  }

  updateWallet() {
    this.getAliases()
    this.getCurrentAddress()
    this.getCurrentBalance()
    this.getInfo()
    this.checkIncompletedAliases()
  }

  checkIncompletedAliases() {
    try {
      const actualBlock = global.appStorage.get('walletinfo').blocks
      global.appStorage.get('tools').newAliases.forEach(i => {
        if (i.round === 3) {
          return this.props.removeFinishedAlias(i.alias)
        }
        if (i.block < actualBlock) {
          this.props.createNewAlias({
            aliasName: i.alias
          }, (err) => {
            if (err) {
              return false
            }

            this.props.incRoundToAlias(i.alias)
          })
        }
      })
    } catch (e) {
      console.log('No user files yet.')
    }
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

  getInfo() {
    this.props.getInfo((err, info) => {
      if (err) {
        console.log(err)
        return
      }

      global.appStorage.set('walletinfo', info)
    })
  }

  generateCurrentAliasBalance() {
    return (
      <span style={{ marginRight: 20 }}>
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
            <Tab tab='Tools' key='3'>
              <Tools
                createNewAlias={this.props.createNewAlias}
                getUnfinishedAliases={this.props.getUnfinishedAliases}
                pushNewAlias={this.props.pushNewAlias}
                removeFinishedAlias={this.props.removeFinishedAlias}
              />
            </Tab>
          </Tabs>
        </Col>
      </Row>
    )
  }
}
