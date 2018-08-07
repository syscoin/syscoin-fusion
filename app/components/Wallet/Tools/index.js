// @flow
import React, { Component } from 'react'
import { Row, Col } from 'antd'
import NewAlias from './components/new-alias'

type Props = {
  getUnfinishedAliases: Function,
  pushNewAlias: Function,
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
        </Col>
      </Row>
    )
  }
}
