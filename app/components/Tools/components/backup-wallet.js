// @flow
import React, { Component } from 'react'
import { Button, Icon, Spin } from 'antd'
import swal from 'sweetalert'
import { join } from 'path'

type Props = {
  exportWallet: Function,
  getFolder: Function
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

  backupWallet() {
    this.setState({
      isLoading: true
    })
    this.props.getFolder(path => {
      if (!path) {
        return
      }
      // Adds filename to selected path
      const fullPath = join(path[0], `backup_${Date.now()}.dat`)

      this.props.exportWallet(fullPath, err => {
        this.setState({
          isLoading: false
        })
        if (err) {
          return swal('Error', 'Error while saving the backup', 'error')
        }

        swal('Success', 'Backup saved successfully', 'success')
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
          <Button className='backup-wallet-btn' disabled={this.state.isLoading} onClick={this.backupWallet.bind(this)}>
            <Icon type='download' /> Backup wallet
          </Button>
        )}
      </div>
    )
  }
}
