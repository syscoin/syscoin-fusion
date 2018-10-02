// @flow
import React, { Component } from 'react'
import { Row, Col, Tabs, Icon, Spin } from 'antd'
import map from 'async/map'
import { ipcRenderer } from 'electron'

import AccountsContainer from 'fw-containers/Accounts'
import SendContainer from 'fw-containers/Send'
import Tools from './Tools'
import Personalize from './Personalize'

import isCliRunning from '../../utils/is-sys-cli-running'
import loadCustomCss from '../../utils/load-css'
import getPaths from '../../utils/get-doc-paths'


const Tab = Tabs.TabPane

type Props = {
  aliasInfo: Function,
  currentSysAddress: Function,
  currentBalance: Function,
  editAlias: Function,
  getAliases: Function,
  getAssetInfo: Function,
  getAssetAllocationInfo: Function,
  getUnfinishedAliases: Function,
  importWallet: Function,
  exportWallet: Function,
  incRoundToAlias: Function,
  pushNewAlias: Function,
  removeFinishedAlias: Function,
  createNewAlias: Function,
  getPrivateKey: Function,
  getTransactionsPerAsset: Function
};

type State = {
  aliases: Array<Object>,
  address: string,
  balance: string
}

export default class Wallet extends Component<Props, State> {
  props: Props

  constructor(props: Props) {
    super(props)

    this.state = {
      aliases: [],
      address: '',
      balance: ''
    }
  }

  componentWillMount() {
    loadCustomCss(getPaths().customCssPath)
  }

  getAssetAllocationInfo(alias: string, cb: Function) {
    const guids = global.appStorage.get('guid')

    if (guids[0] === 'none') {
      return cb('NO_ASSET_SELECTED')
    }

    map(guids, (i, done) => {
      this.props.getAssetAllocationInfo({
        assetId: i,
        aliasName: alias
      }, (err, info) => {
        if (err) {
          if (err.message.indexOf('ERRCODE: 1507')) {
            return done(null, {
              balance: 0,
              alias: alias,
              asset: i
            })
          }
          return done(err)
        }

        done(null, info)
      })
    }, (err, result) => {
      if (err) {
        return cb(err)
      }

      return cb(null, result)
    })
  }

  checkIncompletedAliases() {
    try {
      const actualBlock = global.appStorage.get('walletinfo').blocks
      global.appStorage.get('tools').newAliases.forEach(i => {
        if (i.block < actualBlock) {
          this.props.createNewAlias({
            aliasName: i.alias
          }, (err) => {
            if (err) {
              if (err.message.indexOf('ERRCODE: 5505') !== -1) {
                this.props.removeFinishedAlias(i.alias)
              }
              return false
            }

            this.props.incRoundToAlias(i.alias)
          })
        }
      })
    } catch (e) {
      return false
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

  generateCurrentAliasBalance() {
    return (
      <span style={{ marginRight: 20 }}>
        Balance: {this.state.aliases.map(i => i.balance).reduce((prev, next) => (next + prev), 0)} SYS
      </span>
    )
  }

  generateWindowControls() {
    return (
      <div className='window-controls'>
        <Icon type='minus' className='minimize' onClick={this.onMinimize} />
        <Icon type='close' className='close' onClick={this.onClose} />
      </div>
    )
  }

  onMinimize() {
    ipcRenderer.send('minimize')
  }

  onClose() {
    ipcRenderer.send('close')
  }

  render() {
    return (
      <Row className='app-body'>
        <Col xs={24}>
          <Tabs className='tabs-app' tabBarExtraContent={this.generateWindowControls()}>
            <Tab className='tab tab-accounts' tab='Accounts' key='1'>
              <AccountsContainer />
            </Tab>
            <Tab className='tab tab-send' tab='Send' key='2'>
              <SendContainer />
            </Tab>
            <Tab className='tab tab-tools' tab='Tools' key='3'>
              <Tools
                createNewAlias={this.props.createNewAlias}
                getUnfinishedAliases={this.props.getUnfinishedAliases}
                getPrivateKey={this.props.getPrivateKey}
                exportWallet={this.props.exportWallet}
                importWallet={this.props.importWallet}
                pushNewAlias={this.props.pushNewAlias}
                removeFinishedAlias={this.props.removeFinishedAlias}
              />
            </Tab>
            <Tab className='tab tab-personalize' tab='Personalize' key='4'>
              <Personalize
                aliasInfo={this.props.aliasInfo}
                currentAliases={this.state.aliases || []}
                editAlias={this.props.editAlias}
              />
            </Tab>
          </Tabs>
        </Col>
      </Row>
    )
  }
}
