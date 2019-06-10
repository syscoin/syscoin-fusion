// @flow
import React, { Component } from 'react'
import { Button } from 'antd'
import syspath from 'fw-utils/syspath'

type Props = {
  appDir: string,
  getFolder: Function,
  setAppDir: Function
};

export default class ExportWallet extends Component<Props, State> {
  props: Props;

  render() {
    return (
      <div className='appdir-container'>
        <h3>Current wallet directory:</h3>
        <p><span>{this.props.appDir ? this.props.appDir : syspath()}</span></p>
        <div>
          <Button onClick={() => this.props.getFolder((path) => path ? this.props.setAppDir(path[0]) : null)}>
            Change path
          </Button>
        </div>
        <div>
          <Button onClick={() => this.props.setAppDir('')}>
            Switch to default
          </Button>
        </div>
      </div>
    )
  }
}
