// @flow
import React, { Component } from 'react'
// import { Link } from 'react-router-dom'
import { Row, Col } from 'antd'

const { exec } = require('child_process')
const generateCmd = require('../../../utils/cmd-gen')

type Props = {};

export default class Accounts extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props)

    this.state = {
      currentAddress: '',
      currentBalance: ''
    }
  }

  componentWillMount() {
    this.setCurrentAddress()
    this.setCurrentBalance()
  }

  setCurrentAddress() {
    exec(generateCmd('cli', 'getaccountaddress ""'), (err, stdout) => {
      this.setState({
        currentAddress: stdout.toString()
      })
    })
  }

  setCurrentBalance() {
    exec(generateCmd('cli', 'getbalance'), (err, stdout) => {
      this.setState({
        currentBalance: stdout.toString()
      })
    })
  }

  render() {
    return (
      <Row>
        <Col
          xs={24}
          style={{
            textAlign: 'center'
          }}
        >
          <p>This is your current address:</p>
          <p>{this.state.currentAddress}</p>
          <p>Current balance:</p>
          <p>{this.state.currentBalance}</p>
        </Col>
      </Row>
    )
  }
}
