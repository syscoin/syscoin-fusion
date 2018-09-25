// @flow
import React, { Component } from 'react'
import { Upload, Button, Icon, Spin } from 'antd'
import swal from 'sweetalert'
import { join } from 'path'

type Props = {
  exportWallet: Function
};

type State = {
  isLoading: boolean
};

export default class ExportWallet extends Component<Props, State> {
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
      const fullPath = join(dir.path, `backup_${Date.now()}.dat`)

      this.props.exportWallet(fullPath, err => {
        this.setState({
          isLoading: false
        })
        if (err) {
          swal('Error', 'Error while saving the backup', 'error')
          return reject()
        }

        swal('Success', 'Backup saved successfully', 'success')

        return reject() // Rejecting anyway because of Upload component limitations. Check antd Upload documentation.
      })
    })
  }

  render() {
    return (
      <div className='backup-wallet-container'>
        <h3 className='backup-wallet-title'>Backup wallet</h3>
        {this.state.isLoading ? (
          <Spin indicator={<Icon type='loading' className='loading-tools' spin />} />
        ) : (
          <Upload action='' beforeUpload={this.beforeUpload.bind(this)} showUploadList={false} directory>
            <Button className='backup-wallet-btn' disabled={this.state.isLoading}>
              <Icon type='download' /> Backup wallet
            </Button>
          </Upload>
        )}
      </div>
    )
  }
}
