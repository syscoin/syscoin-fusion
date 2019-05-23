// @flow
import React, { Component } from 'react'
import { Row, Col, Collapse, Icon } from 'antd'
import BackupWallet from './components/backup-wallet'
import ImportWallet from './components/import-wallet'
import LockWallet from './components/lock-wallet'
import Console from './components/console'
import ChangeLanguage from './components/change-language'

const { Panel } = Collapse

type Props = {
  activeTab: string,
  changeFormTab: Function,
  importWallet: Function,
  exportWallet: Function,
  encryptWallet: Function,
  isEncrypted: boolean,
  changePwd: Function,
  unlockWallet: Function,
  isUnlocked: boolean,
  lockWallet: Function,
  getFolder: Function,
  toggleConsole: Function,
  changeLanguage: Function,
  currentLanguage: string,
  t: Function
};

export default class Tools extends Component<Props> {

  changeTab(tab) {
    if (tab) {
      this.props.changeFormTab(tab, 'toolsTab')
    }
  }

  render() {
    const { t } = this.props
    return (
      <Row className='tools-container'>
        <Col
          xs={10}
          offset={7}
          className='tools-form-container'
        >
          <Collapse accordion activeKey={this.props.activeTab} onChange={this.changeTab.bind(this)}>
            <Panel
              header={
                <h3 className='send-asset-form-title'>
                  {'Asset tools'}
                  <Icon type='down' className='send-form-title-row' />
                </h3>
              }
              key='asset'
            >PAPAPA</Panel>
            <Panel
              header={
                <h3 className='send-asset-form-title'>
                  {'Wallet tools'}
                  <Icon type='down' className='send-form-title-row' />
                </h3>
              }
              key='wallet'
            >
              <BackupWallet exportWallet={this.props.exportWallet} getFolder={this.props.getFolder} t={t} />
              <hr />
              <ImportWallet importWallet={this.props.importWallet} t={t} />
              <hr />
              <LockWallet
                encryptWallet={this.props.encryptWallet}
                isEncrypted={this.props.isEncrypted}
                changePwd={this.props.changePwd}
                unlockWallet={this.props.unlockWallet}
                isUnlocked={this.props.isUnlocked}
                lockWallet={this.props.lockWallet}
                t={t}
              />
              <hr />
              <Console toggleConsole={this.props.toggleConsole} t={t} />
              <hr />
              <ChangeLanguage changeLanguage={this.props.changeLanguage} currentLanguage={this.props.currentLanguage} t={t} />
            </Panel>
          </Collapse>
        </Col>
      </Row>
    )
  }

}
