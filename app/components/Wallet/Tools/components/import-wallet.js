// @flow
import React, { Component } from 'react'
import { Upload, Button, Icon } from 'antd'
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
      <div>
        <h3 className='white-text'>Import wallet</h3>
        <Upload action='' beforeUpload={this.beforeUpload.bind(this)} showUploadList={false}>
          <Button disabled={this.state.isLoading}>
            <Icon type='upload' /> Import wallet
          </Button>
        </Upload>
      </div>
    )
  }
}
