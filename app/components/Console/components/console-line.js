// @flow
import React, { Component } from 'react'
import { Row, Col } from 'antd'
import moment from 'moment'

type Props = {
  cmd: string,
  error: boolean,
  time: number,
  result: any
};

export default class ConsoleLine extends Component<Props> {
  props: Props;

  formatResult(result: any) {
    return JSON.stringify(result, null, 2)
  }

  render() {
    const { cmd, error, time, result } = this.props
    return (
      <Row className={`console-line-container ${error ? 'error-line' : ''}`}>
        <Col xs={22}>
          <div>
            {typeof result === 'string' ? <span title={cmd}>{result}</span> : <pre title={cmd}>{this.formatResult(result)}</pre>}
          </div>
        </Col>
        <Col xs={2}>
          <div className='console-line-date-container'>
            <span>{moment(time).format('HH:mm:ss')}</span>
          </div>
        </Col>
      </Row>
    )
  }
}
