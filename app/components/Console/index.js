// @flow
import React, { Component } from 'react'
import { Row, Col, Input } from 'antd'

import ConsoleLine from './components/console-line'
import formChangeFormat from 'fw-utils/form-change-format'

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
      cmd: ''
    }
  }
  
  componentDidUpdate(prevProps: Props) {
    if (prevProps.data.length !== this.props.data.length) {
      const scroll = document.getElementsByClassName('console-results')[0]

      scroll.scrollTop = scroll.scrollHeight
    }
  }
  
  handleChange(e: Object) {
    this.setState(formChangeFormat(e, 'cmd'))
  }

  send() {
    this.props.handleConsoleSubmit(this.state.cmd)
    this.setState({
      cmd: ''
    })
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
                onKeyDown={e => e.keyCode === 13 ? this.send() : null}
                value={this.state.cmd}
              />
            </div>
          </div>
        </Col>
      </Row>
    )
  }
}
