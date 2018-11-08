// @flow
import React, { Component } from 'react'
import { Row, Col } from 'antd'
import EditAlias from './components/edit-alias'

type Props = {
    aliasInfo: Function,
    currentAliases: Array<Object>,
    editAlias: Function
};

export default class Personalize extends Component<Props> {
  props: Props;

  render() {
    return (
      <Row className='personalize-container'>
        <Col
          xs={8}
          offset={8}
          style={{
            textAlign: 'center'
          }}
        >
          <EditAlias
            aliasInfo={this.props.aliasInfo}
            currentAliases={this.props.currentAliases}
            editAlias={this.props.editAlias}
          />
        </Col>
      </Row>
    )
  }
}
