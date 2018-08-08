// @flow
import React, { Component } from 'react'
import { Upload, Button, Icon } from 'antd'
import swal from 'sweetalert'
import { join } from 'path'

type Props = {
  exportWallet: Function
};

export default class ExportWallet extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props)

    this.state = {
      isLoading: false
    }
  }

  beforeUpload(dir) {
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
      <div>
        <h3 className='white-text'>Backup wallet</h3>
        <Upload action='' beforeUpload={this.beforeUpload.bind(this)} showUploadList={false} directory>
          <Button disabled={this.state.isLoading}>
            <Icon type='download' /> Backup wallet
          </Button>
        </Upload>
      </div>
    )
  }
}
