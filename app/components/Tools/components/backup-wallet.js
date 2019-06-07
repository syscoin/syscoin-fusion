// @flow
import React, { Component } from 'react'
import { Button, Icon, Spin } from 'antd'
import swal from 'sweetalert'
import { join } from 'path'

type Props = {
  exportWallet: Function,
  getFolder: Function,
  t: Function
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
    const { t } = this.props

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
          return swal(t('misc.error'), t('tools.backup_error'), 'error')
        }

        swal(t('misc.success'), t('tools.backup_success'), 'success')
      })
    })
  }

  render() {
    const { t } = this.props
    return (
      <div className='backup-wallet-container'>
        <h3 className='backup-wallet-title'>{t('tools.backup_wallet')}</h3>
        {this.state.isLoading ? (
          <Spin indicator={<Icon type='loading' className='loading-tools' spin />} />
        ) : (
          <Button className='backup-wallet-btn' disabled={this.state.isLoading} onClick={this.backupWallet.bind(this)}>
            <Icon type='download' /> {t('tools.backup_wallet')}
          </Button>
        )}
      </div>
    )
  }
}
