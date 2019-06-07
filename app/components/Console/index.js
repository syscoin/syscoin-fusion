// @flow
import React, { Component } from 'react'
import { Row, Col, Input } from 'antd'

import formChangeFormat from 'fw-utils/form-change-format'
import ConsoleLine from './components/console-line'

type Props = {
  handleConsoleSubmit: Function,
  data: Array<Object>,
  history: Array<string>
};

type State = {
  cmd: string
};

export default class Console extends Component<Props, State> {
  props: Props;

  constructor(props: Props) {
    super(props)

    this.state = {
      cmd: '',
      currentCmdIndex: null
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.data.length !== this.props.data.length) {
      const scroll = document.getElementsByClassName('console-results')[0]

      scroll.scrollTop = scroll.scrollHeight
    }
  }

  handleChange(e: Object) {
    this.setState({
      currentCmdIndex: null
    })
    this.setState(formChangeFormat(e, 'cmd'))
  }

  send() {
    if (this.state.cmd === '') {
      return
    }

    this.props.handleConsoleSubmit(this.state.cmd)
    this.setState({
      cmd: '',
      currentCmdIndex: null
    })
  }

  keyCommands(keyCode) {
    const { history } = this.props
    let { currentCmdIndex } = this.state
    currentCmdIndex = typeof currentCmdIndex === 'number' ? currentCmdIndex : history.length

    switch (keyCode) {
      case 13:
        this.send()
        break
      case 40:
        this.setState({
          cmd: history[currentCmdIndex + 1] || '',
          currentCmdIndex: currentCmdIndex > history.length - 1 ? history.length : currentCmdIndex + 1
        })
        break
      case 38:
        this.setState({
          cmd: history[currentCmdIndex - 1] || '',
          currentCmdIndex: currentCmdIndex <= 0 ? -1 : currentCmdIndex - 1  
        })
        break
      default:
        return false
    }
  }

  render() {
    return (
      <Row>
        <Col xs={22} offset={1}>
          <div className='console-container'>
            <div className='console-results'>
              {this.props.data.map(i => <ConsoleLine {...i} key={i.time} />)}
            </div>
            <div className='console-input-container'>
              <Input
                type='text'
                name='cmd'
                onChange={this.handleChange.bind(this)}
                onKeyDown={e => this.keyCommands(e.keyCode)}
                value={this.state.cmd}
              />
            </div>
          </div>
        </Col>
      </Row>
    )
  }
}
