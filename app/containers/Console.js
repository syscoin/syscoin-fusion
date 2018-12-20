// @flow
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withNamespaces } from 'react-i18next'

import Console from 'fw-components/Console'
import { pushToConsole } from 'fw-actions/console'
import { callRpc } from 'fw-sys'

type Props = {
  pushToConsole: Function,
  console: {
    show: boolean,
    data: Array<LogItem>,
    history: Array<string>
  }
};

type LogItem = {
  cmd: string,
  result: any,
  time: number,
  error: boolean
};

class ConsoleContainer extends Component<Props> {

  componentWillMount() {
    if (!this.props.console.data.length) {
      this.props.pushToConsole({
        cmd: '',
        result: 'Welcome to Fusion Wallet console!',
        error: false,
        time: Date.now()
      })
    }
  }

  parseParam(param) {
    if (Number(param) == param) {
      return Number(param)
    }
    
    let json

    try {
      json = JSON.parse(param)
    } catch(err) {
      // If its not json or number, just return param
      return param
    }

    // if JSON.parse is successfull, return parsed json.
    return json
  }

  async handleConsoleSubmit(cmd) {
    const splitCmd = cmd.split(' ')
    let result

    const parseParams = splitCmd.slice(1).map(i => this.parseParam(i))

    try {
      result = await callRpc(splitCmd[0], parseParams)
    } catch (err) {
      return this.props.pushToConsole({
        cmd,
        result: err.message,
        time: Date.now(),
        error: true
      })
    }

    return this.props.pushToConsole({
      cmd,
      result,
      time: Date.now(),
      error: false
    })
  }

  render() {
    return (
      <Console
        handleConsoleSubmit={this.handleConsoleSubmit.bind(this)}
        history={this.props.console.history}
        data={this.props.console.data}
      />
    )
  }
}

const mapStateToProps = state => ({
  console: state.console
})

const mapDispatchToProps = dispatch => bindActionCreators({
  pushToConsole
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(withNamespaces('translation')(ConsoleContainer))
