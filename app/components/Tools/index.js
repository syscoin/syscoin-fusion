// @flow
import React, { Component } from 'react'
import { Row, Col } from 'antd'
// import NewAlias from './components/new-alias'
import BackupWallet from './components/backup-wallet'
import ImportWallet from './components/import-wallet'
import LockWallet from './components/lock-wallet'

type Props = {
  /* currentBlock: number,
  unfinishedAliases: Array<{
    aliasName: string,
    block: number,
    round: number
  }>,
  createNewAlias: Function, */
  importWallet: Function,
  exportWallet: Function,
  encryptWallet: Function,
  isEncrypted: boolean,
  changePwd: Function,
  unlockWallet: Function,
  isUnlocked: boolean,
  lockWallet: Function,
  getFolder: Function
};

export default class Tools extends Component<Props> {

  render() {
    return (
      <Row className='tools-container'>
        <Col
          xs={8}
          offset={8}
          className='tools-form-container'
        >
          {/* <NewAlias
            unfinishedAliases={this.props.unfinishedAliases}
            createNewAlias={this.props.createNewAlias}
            title='Create new alias'
            currentBlock={this.props.currentBlock}
          />
          <hr /> */}
          <BackupWallet exportWallet={this.props.exportWallet} getFolder={this.props.getFolder} />
          <hr />
          <ImportWallet importWallet={this.props.importWallet} />
          <hr />
          <LockWallet
            encryptWallet={this.props.encryptWallet}
            isEncrypted={this.props.isEncrypted}
            changePwd={this.props.changePwd}
            unlockWallet={this.props.unlockWallet}
            isUnlocked={this.props.isUnlocked}
            lockWallet={this.props.lockWallet}
          />
        </Col>
      </Row>
    )
  }

}
