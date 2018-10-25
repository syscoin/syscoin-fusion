// @flow
import React, { Component } from 'react'
import { Col, Input, Button, Select, Spin, Icon } from 'antd'
import swal from 'sweetalert'
import formChangeFormat from 'fw-utils/form-change-format'
import parseError from 'fw-utils/error-parser'

const { Option } = Select

type Props = {
  title: string,
  columnSize: number,
  aliases: Array<string>,
  assets: Array<string>,
  isLoading: boolean,
  sendAsset: Function
};

type State = {
  from: string,
  asset: string,
  toAddress: string,
  amount: string,
  comment: string
};

export default class SendAssetForm extends Component<Props, State> {
  initialState: State;

  constructor(props: Props) {
    super(props)

    this.initialState = {
      from: '',
      asset: '',
      toAddress: '',
      amount: '',
      comment: ''
    }

    this.state = {
      ...this.initialState
    }
  }

  updateField(value: string | Object, name: string, filter?: RegExp) {
    const toUpdate = formChangeFormat(value, name, filter)

    if (filter && !filter.test(toUpdate[name])) {
      if (toUpdate[name]) {
        return
      }
    }

    this.setState(toUpdate)
  }
  
  resetForm() {
    this.setState({
      ...this.initialState
    })
  }
  
  render() {
    const {
      title = 'Send Address',
      columnSize = 12,
      aliases = [],
      assets = [],
      isLoading = false,
      sendAsset
    } = this.props
    const {
      from,
      asset,
      toAddress,
      amount,
      comment
    } = this.state

    return (
      <Col
        xs={columnSize}
        className='send-asset-container'
        style={{
          padding: '40px 40px 40px 80px'
        }}
      >
        <div className='send-asset-form-container'>
          <h3 className='send-asset-form-title'>{title}</h3>
          <Select
            disabled={isLoading}
            onChange={val => this.updateField(val, 'from')}
            placeholder='Select alias'
            className='send-asset-form-control send-asset-form-select-alias'
            value={from.length ? from : undefined}
          >
            {aliases.map(i => (
              <Option value={i} key={i}>
                {i}
              </Option>
            ))}
          </Select>
          <Select
            disabled={isLoading}
            onChange={val => this.updateField(val, 'asset')}
            placeholder='Select asset'
            className='send-asset-form-control send-asset-form-select-alias'
            value={asset.length ? asset : undefined}
          >
            {assets.map(i => (
              <Option value={i} key={i}>
                {i}
              </Option>
            ))}
          </Select>
          <Input
            disabled={isLoading}
            name='toAddress'
            placeholder='Send to address...'
            onChange={e => this.updateField(e, 'toAddress')}
            value={toAddress}
            className='send-asset-form-control send-asset-form-to-address'
          />
          <Input
            disabled={isLoading}
            name='amount'
            placeholder='Amount'
            onChange={e => this.updateField(e, 'amount', /^\d+(\.)?(\d+)?$/)}
            value={amount}
            className='send-asset-form control send-asset-form-asset'
          />
          <Input
            disabled={isLoading}
            name='comment'
            placeholder='Comment'
            onChange={e => this.updateField(e, 'comment')}
            value={comment}
            className='send-asset-form control send-asset-form-asset'
          />
          <div className='send-asset-form-btn-container'>
            {isLoading && <Spin indicator={<Icon type='loading' spin />} className='send-loading' />}
            <Button
              className='send-asset-form-btn-send'
              disabled={isLoading || !from || !asset || !toAddress || !amount}
              onClick={() => sendAsset(this.state, err => {
                if (err) {
                  return swal('Error', parseError(err.message), 'error')
                }

                this.resetForm()
                return swal('Success', 'Asset successfully sent', 'success')
              })}
            >
              Send
            </Button>
          </div>
        </div>
      </Col>
    )
  }
}
