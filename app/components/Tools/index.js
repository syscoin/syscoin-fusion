// @flow
import React, { Component } from 'react'
import { Row, Col } from 'antd'
import NewAlias from './components/new-alias'
import BackupWallet from './components/backup-wallet'
import ImportWallet from './components/import-wallet'
import GetPrivateKey from './components/get-priv-key'

type Props = {
  currentBlock: number,
  unfinishedAliases: Array<{
    aliasName: string,
    block: number,
    round: number
  }>,
  createNewAlias: Function,
  getPrivateKey: Function,
  importWallet: Function,
  exportWallet: Function
};
type State = {
  newAlias: {
    aliasName: string,
    publicValue: string,
    acceptTransferFlags: number,
    expireTimestamp: string,
    address: string,
    encryptionPrivKey: string,
    encryptionPublicKey: string,
    witness: string
  }
};

export default class Tools extends Component<Props, State> {
  props: Props;

  constructor(props: Props) {
    super(props)

    this.state = {
      newAlias: {
        aliasName: '',
        publicValue: '',
        acceptTransferFlags: 3,
        expireTimestamp: '1548184538',
        address: '',
        encryptionPrivKey: '',
        encryptionPublicKey: '',
        witness: ''
      }
    }
  }

  updateFields(e: Object, mode: string) {
    const { name, value } = e.target
    const newState = { ...this.state }

    newState[mode][name] = value

    this.setState(newState)
  }

  render() {
    return (
      <Row className='tools-container'>
        <Col
          xs={8}
          offset={8}
          className='tools-form-container'
        >
          <NewAlias
            unfinishedAliases={this.props.unfinishedAliases}
            createNewAlias={this.props.createNewAlias}
            title='Create new alias'
            currentBlock={this.props.currentBlock}
          />
          <hr />
          <BackupWallet exportWallet={this.props.exportWallet} />
          <hr />
          <ImportWallet importWallet={this.props.importWallet} />
          <hr />
          <GetPrivateKey getPrivateKey={this.props.getPrivateKey} />
        </Col>
      </Row>
    )
  }
}
