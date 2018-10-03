// @flow
import React, { Component } from 'react'
import { Row, Col } from 'antd'
import NewAlias from './components/new-alias'
import BackupWallet from './components/backup-wallet'
import ImportWallet from './components/import-wallet'
import GetPrivateKey from './components/get-priv-key'

type Props = {
  getUnfinishedAliases: Function,
  pushNewAlias: Function,
  exportWallet: Function,
  getPrivateKey: Function,
  importWallet: Function,
  createNewAlias: Function
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
    const newState = {...this.state}

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
            createNewAlias={this.props.createNewAlias}
            updateFields={this.updateFields.bind(this)}
            aliasName={this.state.newAlias.aliasName}
            publicValue={this.state.newAlias.publicValue}
            acceptTransferFlags={this.state.newAlias.acceptTransferFlags}
            expireTimestamp={this.state.newAlias.expireTimestamp}
            address={this.state.newAlias.address}
            encryptionPrivKey={this.state.newAlias.encryptionPrivKey}
            encryptionPublicKey={this.state.newAlias.encryptionPublicKey}
            witness={this.state.newAlias.witness}
            getUnfinishedAliases={this.props.getUnfinishedAliases}
            pushNewAlias={this.props.pushNewAlias}
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
