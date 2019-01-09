// @flow
import React, { Component } from 'react'
import { Col, Input, Button, Spin, Icon } from 'antd'
import swal from 'sweetalert'
import formChangeFormat from 'fw-utils/form-change-format'
import parseError from 'fw-utils/error-parser'

type Props = {
  title: string,
  columnSize: number,
  balance: number,
  isLoading: boolean,
  sendSys: Function,
  onChangeForm: Function,
  form: {
    data: {
      comment: string,
      address: string,
      amount: string
    }
  },
  t: Function
};

export default class SendAssetForm extends Component<Props> {

  updateField(value: string | Object, name: string, filter?: RegExp) {
    let toUpdate = formChangeFormat(value, name)

    if (filter && !filter.test(toUpdate[name])) {
      if (toUpdate[name]) {
        return
      }
    }

    toUpdate = {
      ...this.props.form.data,
      ...toUpdate
    }

    this.props.onChangeForm(toUpdate, 'sys')
  }

  resetForm() {
    this.props.onChangeForm({
      amount: 0,
      address: '',
      comment: ''
    }, 'sys')
  }

  render() {
    const { t } = this.props
    const {
      title = t('send.send_sys.title'),
      columnSize = 12,
      balance = '0.00',
      isLoading = false,
      sendSys,
      form
    } = this.props
    const {
      amount,
      comment,
      address
    } = form.data

    return (
      <div
        className='send-sys-container'
      >
        <div className='send-sys-form-container'>
          <h4 className='send-sys-form-balance'>{t('send.send_sys.current_balance')} <span className='send-sys-form-balance-number'>{balance}</span></h4>
          <Input
            disabled={isLoading}
            name='address'
            placeholder={t('send.send_sys.send_to')}
            onChange={e => this.updateField(e, 'address')}
            value={address}
            className='send-sys-form-control send-sys-form-to-address'
          />
          <Input
            disabled={isLoading}
            name='amount'
            placeholder={t('send.send_sys.amount')}
            pattern='\d+'
            onChange={e => this.updateField(e, 'amount', /^\d+(\.)?(\d+)?$/)}
            value={amount}
            className='send-sys-form-control send-sys-form-amount'
          />
          <Input
            disabled={isLoading}
            name='comment'
            placeholder={t('send.send_sys.comment')}
            onChange={e => this.updateField(e, 'comment')}
            value={comment}
            className='send-sys-form-control send-sys-form-comment'
          />
          <div
            className='send-asset-form-btn-container'
          >
            {isLoading && <Spin indicator={<Icon type='loading' spin />} className='send-loading' />}
            <Button
              disabled={!amount || !address || isLoading}
              onClick={() => {
                sendSys(this.props.form.data, err => {
                  if (err) {
                    return swal(t('misc.error'), parseError(err.message), 'error')
                  }

                  this.resetForm()
                  return swal(t('misc.success'), t('send.send_sys.sys_send_success'), 'success')
                })
              }}
              className='send-sys-form-btn-send'
            >
              {t('misc.send')}
            </Button>
          </div>
        </div>
      </div>
    )
  }
}
