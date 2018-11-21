// @flow
import React, { Component } from 'react'
import { Button, Icon, Spin } from 'antd'
import swal from 'sweetalert2'
import parseError from 'fw-utils/error-parser'

type Props = {
  lockWallet: Function
};

export default class LockWallet extends Component<Props> {
  props: Props;

  constructor(props: Props) {
    super(props)

    this.state = {
      isLoading: false
    }
  }

  async handleClick() {
    let result

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

    // result = await this.props.lockWallet(pwd.value)

  }

  render() {
    return (
      <div className='get-priv-key-container'>
        <h3 className='get-priv-key-title'>Lock Wallet</h3>
        <Button
          className='get-priv-key-btn'
          disabled={this.state.isLoading}
          onClick={this.handleClick.bind(this)}
        >
          <Icon type='lock' /> Lock Wallet
        </Button>
      </div>
    )
  }
}
