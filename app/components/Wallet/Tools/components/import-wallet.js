// @flow
import React, { Component } from 'react'
import { Upload, Button, Icon, Spin } from 'antd'
import swal from 'sweetalert'

type Props = {
  importWallet: Function
};
type State = {
  isLoading: boolean
};

export default class ImportWallet extends Component<Props, State> {
  props: Props;

  constructor(props: Props) {
    super(props)

    this.state = {
      isLoading: false
    }
  }

  beforeUpload(dir: Object) {
    this.setState({
      isLoading: true
    })
    return new Promise((resolve, reject) => {
      // Adds filename to selected path

      this.props.importWallet(dir.path, err => {
        this.setState({
          isLoading: false
        })
        if (err) {
          swal('Error', 'Error while Loading the backup', 'error')
          return reject()
        }

        swal('Success', 'Backup loaded successfully', 'success')

        return reject() // Rejecting anyway because of Upload component limitations. Check antd Upload documentation.
      })
    })
  }

  render() {
    return (
      <div className='import-wallet-container'>
        <h3 className='import-wallet-title'>Import wallet</h3>
        {this.state.isLoading ? (
          <Spin indicator={<Icon type='loading' className='loading-tools' spin />} />
        ) : (
          <Upload action='' beforeUpload={this.beforeUpload.bind(this)} showUploadList={false}>
            <Button disabled={this.state.isLoading} className='import-wallet-btn'>
              <Icon type='upload' /> Import wallet
            </Button>
          </Upload>
        )}
      </div>
    )
  }
}
