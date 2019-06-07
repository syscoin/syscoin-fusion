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
  },
  fusion: Object
};

type LogItem = {
  cmd: string,
  result: any,
  time: number,
  error: boolean
};

class ConsoleContainer extends Component<Props> {

  constructor(props: Props) {
    super(props)

    this.fusionReservedCmds = ['getfusiondata']
  }

  componentWillMount() {
    if (!this.props.console.data.length) {
      this.props.pushToConsole({
        cmd: '',
        result: this.props.t('console.welcome', {
          appName: this.props.t('general.app_name')
        }),
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

    if(param[0] == "'" && param[param.length - 1] == "'"){
      param = param.slice(1, param.length - 1)
    }

    try {
      json = JSON.parse(param)
    } catch(err) {
      // If its not json or number, just return param
      return param
    }

    // if JSON.parse is successfull, return parsed json.
    return json
  }

  handleFusionCmd(cmd) {
    switch(cmd) {
      case 'getfusiondata':
        return this.props.fusion
      default:
        return {}
    }
  }

  isFusionCmd(cmd) {
    return this.fusionReservedCmds.indexOf(cmd) !== -1
  }

  async handleConsoleSubmit(cmd) {
    if (this.isFusionCmd(cmd)) {
      const output = this.handleFusionCmd(cmd)

      return this.props.pushToConsole({
        cmd,
        result: output,
        time: Date.now(),
        error: false
      })
    }

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
        t={this.props.t}
      />
    )
  }
}

const mapStateToProps = state => ({
  console: state.console,
  fusion: state
})

const mapDispatchToProps = dispatch => bindActionCreators({
  pushToConsole
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(withNamespaces('translation')(ConsoleContainer))
