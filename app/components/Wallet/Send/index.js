// @flow
import React, { Component } from 'react'
// import { Link } from 'react-router-dom'
import { Row, Select } from 'antd'
import swal from 'sweetalert'
import {
  sendSysTransaction
} from '../../../utils/sys-helpers'

import SendAssetForm from './components/send-asset'


type Props = {
  assetIsLoading: boolean,
  aliases: Array<string>,
  sendAsset: Function
};

type sendAssetType = {
  from: string,
  asset: string,
  toAddress: string,
  amount: string
};

export default class Send extends Component<Props, State> {

  sendSys(obj: Object) {
    const { amount, toAddress: address, comment } = this.state.sys

    this.setState({
      sys: {
        ...this.state.sys,
        isLoading: true
      }
    })

    sendSysTransaction({
      address,
      comment,
      amount: amount.toString()
    }, (err) => {

      if (err) {
        this.setState({
          sys: {
            ...this.state.sys,
            isLoading: false
          }
        })
        return swal('Error', 'Something went wrong during the transaction', 'error')
      }

      this.setState({
        sys: {
          address: '',
          amount: '',
          comment: '',
          isLoading: false
        }
      })

      return swal('Success', `${amount} SYS has been successfully sent to ${address}.`, 'success')
    })
  }

  sendAsset(obj: sendAssetType, cb: Function) {
    this.props.sendAsset(obj, err => cb(err))
  }

  render() {
    return (
      <Row gutter={24}>
        <SendAssetForm
          isLoading={this.props.assetIsLoading}
          title='Send Asset'
          columnSize={12}
          assets={window.appStorage.get('guid')}
          aliases={this.props.aliases}
          sendAsset={this.sendAsset.bind(this)}
        />
      </Row>
    )
  }
}


/*<Col
          xs={12}
          className='send-sys-container'
          style={{
            padding: '40px 80px 40px 40px'
          }}
        >
          <div className='send-sys-form-container'>
            <h3 className='send-sys-form-title'>Send SYS</h3>
            <h4 className='send-sys-form-balance'>Current balance: <span className='send-sys-form-balance-number'>{this.props.currentBalance}</span></h4>
            <Input
              name='toAddress'
              placeholder='Send to address...'
              onChange={e => this.updateFields(e, 'sys')}
              value={this.state.sys.toAddress}
              className='send-sys-form-control send-sys-form-to-address'
            />
            <Input
              name='amount'
              placeholder='Amount'
              pattern='\d+'
              onChange={e => this.updateFields(e, 'sys')}
              value={this.state.sys.amount}
              className='send-sys-form-control send-sys-form-amount'
            />
            <Input
              name='comment'
              placeholder='Comment'
              onChange={e => this.updateFields(e, 'sys')}
              value={this.state.sys.comment}
              className='send-sys-form-control send-sys-form-comment'
            />
            <div
              className='send-asset-form-btn-container'
            >
              {this.state.sys.isLoading && <Spin indicator={<Icon type='loading' spin />} className='send-loading' />}
              <Button
                disabled={!this.state.sys.amount || !this.state.sys.toAddress || this.state.sys.isLoading}
                onClick={this.sendSys.bind(this)}
                className='send-sys-form-btn-send'
              >
                Send
              </Button>
            </div>
          </div>
        </Col>*/
