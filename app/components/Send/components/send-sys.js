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
  sendSys: Function
};

type State = {
  comment: string,
  address: string,
  amount: string
};

export default class SendAssetForm extends Component<Props, State> {

  constructor(props: Props) {
    super(props)

    this.initialState = {
      comment: '',
      address: '',
      amount: ''
    }

    this.state = {
      ...this.initialState
    }
  }

  updateField(value, name) {
    const toUpdate = formChangeFormat(value, name)

    this.setState(toUpdate)
  }

  resetForm() {
    this.setState({
      ...this.initialState
    })
  }

  render() {
    const {
      title = 'Send SYS',
      columnSize = 12,
      balance = '0.00',
      isLoading = false,
      sendSys
    } = this.props
    const {
      amount,
      comment,
      address
    } = this.state

    return (
      <Col
        xs={columnSize}
        className='send-sys-container'
        style={{
          padding: '40px 80px 40px 40px'
        }}
      >
        <div className='send-sys-form-container'>
          <h3 className='send-sys-form-title'>{title}</h3>
          <h4 className='send-sys-form-balance'>Current balance: <span className='send-sys-form-balance-number'>{balance}</span></h4>
          <Input
            name='address'
            placeholder='Send to address...'
            onChange={e => this.updateField(e, 'address')}
            value={address}
            className='send-sys-form-control send-sys-form-to-address'
          />
          <Input
            name='amount'
            placeholder='Amount'
            pattern='\d+'
            onChange={e => this.updateField(e, 'amount')}
            value={amount}
            className='send-sys-form-control send-sys-form-amount'
          />
          <Input
            name='comment'
            placeholder='Comment'
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
                sendSys(this.state, err => {
                  if (err) {
                    return swal('Error', parseError(err.message), 'error')
                  }

                  this.resetForm()
                  return swal('Success', 'SYS successfully sent', 'success')
                })
              }}
              className='send-sys-form-btn-send'
            >
              Send
            </Button>
          </div>
        </div>
      </Col>
    )
  }
}
