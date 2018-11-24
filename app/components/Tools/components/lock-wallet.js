// @flow
import React, { Component } from 'react'
import { Button, Icon, Tooltip } from 'antd'
import swal from 'sweetalert2'
import parseError from 'fw-utils/error-parser'

type Props = {
  lockWallet: Function,
  isEncrypted: boolean
};
type State = {
  isLoading: boolean
};

export default class LockWallet extends Component<Props, State> {
  props: Props;

  constructor(props: Props) {
    super(props)

    this.state = {
      isLoading: false
    }
  }

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

    await this.props.lockWallet(pwd.value)
  }

  render() {
    return (
      <div className='get-priv-key-container'>
        <h3 className='get-priv-key-title'>Lock Wallet</h3>
        {this.props.isEncrypted ? (
          <div className='lock-utilities'>
            <Button
              className='tools-change-pwd'
              disabled={this.state.isLoading}
            >
              <Icon type='key' /> Change password
            </Button>
            <Button
              className='tools-unlock'
              disabled={this.state.isLoading}
            >
              <Icon type='unlock' /> Unlock for the session
            </Button>
          </div>
        ) : (
          <Button
            className=''
            disabled={this.state.isLoading}
            onClick={this.handleEncrypt.bind(this)}
          >
            <Icon type='lock' /> Lock Wallet
          </Button>
        )}
      </div>
    )
  }
}
