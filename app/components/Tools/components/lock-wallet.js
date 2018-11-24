// @flow
import React, { Component } from 'react'
import { Button, Icon, Tooltip } from 'antd'
import swal from 'sweetalert2'
import parseError from 'fw-utils/error-parser'

type Props = {
  lockWallet: Function,
  isEncrypted: boolean,
  changePwd: Function,
  unlockWallet: Function
};

export default class LockWallet extends Component<Props> {
  props: Props;

  async handleEncrypt() {
    const pwd = await swal({
      title: 'Enter new password',
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
      title: 'Confirm your password',
      input: 'password',
      inputPlaceholder: 'Password',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showCancelButton: true
    })

    if (confirmPwd.dismiss) {
      return
    }

    if (pwd.value !== confirmPwd.value) {
      return swal('Error', 'Passwords does not match', 'error')
    }

    const reboot = await swal({
      title: 'Warning',
      text: "Fusion needs to reboot to complete the wallet encryption. Do you want to continue?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Continue'
    })

    if (reboot.dismiss) {
      return
    }

    try {
      await this.props.lockWallet(pwd.value)
    } catch(err) {
      swal('Error', parseError(err.message), 'error')
    }
  }

  async handleChangePwd() {
    const oldPwd = await swal({
      title: 'Enter old password',
      input: 'password',
      inputPlaceholder: 'Password',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showCancelButton: true
    })

    if (oldPwd.dismiss) {
      return
    }

    const newPwd = await swal({
      title: 'Enter new password',
      input: 'password',
      inputPlaceholder: 'Password',
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
      swal('Error', parseError(err.message), 'error')
      return
    }

    swal('Success', 'Password changed successfully', 'success')
  }

  async handleUnlockForSession() {
    try {
      await this.props.unlockWallet(9999999)
    } catch(err) {
      return
    }

    swal('Success', 'Wallet will remain unlocked until you close Fusion.', 'success')
  }

  render() {
    return (
      <div className='get-priv-key-container'>
        <h3 className='get-priv-key-title'>Lock Wallet</h3>
        {this.props.isEncrypted ? (
          <div className='lock-utilities'>
            <Button
              className='tools-change-pwd'
              onClick={this.handleChangePwd.bind(this)}
            >
              <Icon type='key' /> Change password
            </Button>
            <Button
              className='tools-unlock'
              onClick={this.handleUnlockForSession.bind(this)}
            >
              <Icon type='unlock' /> Unlock for the session
            </Button>
          </div>
        ) : (
          <Button
            className='tools-lock'
            onClick={this.handleEncrypt.bind(this)}
          >
            <Icon type='lock' /> Lock Wallet
          </Button>
        )}
      </div>
    )
  }
}
