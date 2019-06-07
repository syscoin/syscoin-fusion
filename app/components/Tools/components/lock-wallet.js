// @flow
import React, { Component } from 'react'
import { Button, Icon, Spin } from 'antd'
import swal from 'sweetalert2'
import parseError from 'fw-utils/error-parser'

type Props = {
  encryptWallet: Function,
  isEncrypted: boolean,
  changePwd: Function,
  unlockWallet: Function,
  isUnlocked: boolean,
  lockWallet: Function,
  t: Function
};
type State = {
  isLoading: boolean
};

export default class LockWallet extends Component<Props, State> {
  props: Props;

  constructor(props) {
    super(props)

    this.state = {
      isLoading: false
    }
  }

  async handleEncrypt() {
    const { t } = this.props
    
    const pwd = await swal({
      title: t('tools.lock_new_password'),
      input: 'password',
      inputPlaceholder: 'Password',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showCancelButton: true
    })

    if (pwd.dismiss) {
      return
    }

    const confirmPwd = await swal({
      title: t('tools.lock_confirm_password'),
      input: 'password',
      inputPlaceholder: t('misc.password'),
      allowOutsideClick: false,
      allowEscapeKey: false,
      showCancelButton: true
    })

    if (confirmPwd.dismiss) {
      return
    }

    if (pwd.value !== confirmPwd.value) {
      return swal('Error', t('tools.lock_password_dont_match'), 'error')
    }

    const reboot = await swal({
      title: t('misc.warning'),
      text: t('tools.lock_confirmation'),
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: t('misc.continue')
    })

    if (reboot.dismiss) {
      return
    }

    this.setState({
      isLoading: true
    })

    try {
      await this.props.encryptWallet(pwd.value)
    } catch(err) {
      this.setState({
        isLoading: false
      })
      return swal(t('misc.error'), parseError(err.message), 'error')
    }

    swal('Success', 'Wallet has been encrypted.', 'success')

    this.setState({
      isLoading: false
    })
  }

  async handleChangePwd() {
    const { t } = this.props

    const oldPwd = await swal({
      title: t('tools.lock_old_password'),
      input: 'password',
      inputPlaceholder: t('misc.password'),
      allowOutsideClick: false,
      allowEscapeKey: false,
      showCancelButton: true
    })

    if (oldPwd.dismiss) {
      return
    }

    const newPwd = await swal({
      title: t('tools.lock_new_password'),
      input: 'password',
      inputPlaceholder: t('misc.password'),
      allowOutsideClick: false,
      allowEscapeKey: false,
      showCancelButton: true
    })

    if (newPwd.dismiss) {
      return
    }

    try {
      await this.props.changePwd(oldPwd.value, newPwd.value)
    } catch(err) {
      swal(t('error'), parseError(err.message), 'error')
      return
    }

    swal(t('misc.success'), t('tools.lock_success'), 'success')
  }

  async handleUnlockForSession() {
    const { t } = this.props

    try {
      await this.props.unlockWallet(9999999)
    } catch(err) {
      return
    }

    swal(t('misc.success'), t('tools.lock_session_success'), 'success')
  }

  render() {
    const { t } = this.props

    return (
      <div className='get-priv-key-container'>
        <h3 className='get-priv-key-title'>{t('tools.lock_wallet')}</h3>
        {this.props.isEncrypted ? (
          <div className='lock-utilities'>
            <Button
              className='tools-change-pwd'
              onClick={this.handleChangePwd.bind(this)}
            >
              <Icon type='key' /> {t('tools.lock_change_password')}
            </Button>
            <Button
              className='tools-unlock'
              onClick={this.props.isUnlocked ? this.props.lockWallet : this.handleUnlockForSession.bind(this)}
            >
              <Icon type='unlock' /> {this.props.isUnlocked ? t('tools.lock_wallet') : t('tools.lock_unlock_session')}
            </Button>
          </div>
        ) : (
          <div>
            {this.state.isLoading ? (
              <Spin indicator={<Icon type='loading' className='loading-tools' spin />} />
            ) : (
              <Button
                className='tools-lock'
                onClick={this.handleEncrypt.bind(this)}
              >
                <Icon type='lock' /> {t('tools.lock_wallet')}
              </Button>
            )}
          </div>
        )}
      </div>
    )
  }
}
