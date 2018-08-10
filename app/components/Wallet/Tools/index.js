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
  removeFinishedAlias: Function,
  createNewAlias: Function
};
type State = {
  newAlias: {
    aliasName: string
  }
};

export default class Tools extends Component<Props, State> {
  props: Props;

  constructor(props: Props) {
    super(props)

    this.state = {
      newAlias: {
        aliasName: ''
      }
    }
  }

  updateFields(e, mode) {
    const { name, value } = e.target
    const newState = {...this.state}

    newState[mode][name] = value

    this.setState(newState)
  }

  render() {
    return (
      <Row>
        <Col
          xs={8}
          offset={8}
          style={{
            textAlign: 'center'
          }}
        >
          <NewAlias
            createNewAlias={this.props.createNewAlias}
            updateFields={this.updateFields.bind(this)}
            aliasName={this.state.newAlias.aliasName}
            getUnfinishedAliases={this.props.getUnfinishedAliases}
            pushNewAlias={this.props.pushNewAlias}
            removeFinishedAlias={this.props.removeFinishedAlias}
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
