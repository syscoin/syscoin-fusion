// @flow
import React, { Component } from 'react'
import { Button } from 'antd'
import swal from 'sweetalert'
import syspath from 'fw-utils/syspath'

type Props = {
  appDir: string,
  getFolder: Function,
  setAppDir: Function
};

export default class ExportWallet extends Component<Props, State> {
  props: Props;

  changePath() {
    this.props.getFolder((path) => {
      if (path) {
        this.props.setAppDir(path[0])
        swal('Success', 'Data directory has been successfully changed. You must restart Fusion in order to take effect.', 'success')
      }
    })
  }

  render() {
    return (
      <div className='appdir-container'>
        <h3>Current wallet directory:</h3>
        <p><span>{this.props.appDir ? this.props.appDir : syspath()}</span></p>
        <div>
          <Button onClick={() => this.changePath()}>
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
