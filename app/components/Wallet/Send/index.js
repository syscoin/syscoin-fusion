// @flow
import React, { Component } from 'react'
// import { Link } from 'react-router-dom'
import { Row, Col, Input, Button, Select } from 'antd'
import swal from 'sweetalert'
import {
  getAssetInfo,
  sendAsset,
  sendSysTransaction
} from '../../../utils/sys-helpers'


type Props = {
  currentAliases: Array<Object>,
  currentBalance: string,
  updateWallet: () => void
};
type State = {
  asset: {
    selectedAlias: string,
    assetId: string,
    toAddress: string,
    amount: string
  },
  sys: {
    toAddress: string,
    amount: string,
    comment: string
  }
};

const { Option } = Select

export default class Send extends Component<Props, State> {
  props: Props;
  
  constructor(props: Props) {
    super(props)

    this.state = {
      asset: {
        selectedAlias: '',
        assetId: '',
        toAddress: '',
        amount: ''
      },
      sys: {
        toAddress: '',
        amount: '',
        comment: ''
      }
    }
  }

  isUserAssetOwner(cb: Function) {
    if (!this.state.selectedAlias.length &&
      !this.state.toAddress.length &&
      !this.state.assetId.length &&
      !this.state.amount.length
    ) {
      return cb(true)
    }

    getAssetInfo({
      assetId: this.state.assetId,
      aliasName: this.state.selectedAlias
    }, (err) => {
      if (err) {
        return cb(true)
      }

      return cb(null)
    })
  }

  sendAsset() {
    const { selectedAlias: fromAlias, toAddress: toAlias, assetId, amount } = this.state.asset

    this.isUserAssetOwner((err) => {
      if (err) {
        return swal('Error', 'You do not own that asset.', 'error')
      }

      sendAsset({
        fromAlias,
        toAlias,
        assetId,
        amount
      }, (errSend) => {
        if (errSend) {
          return swal('Error', 'Error while sending the asset.', 'error')
        }

        swal('Success', 'Asset sent.', 'success')
      })
    })
  }

  sendSys() {
    const { amount, toAddress: address, comment } = this.state.sys

    sendSysTransaction({
      address,
      comment,
      amount: amount.toString()
    }, (err) => {
      if (err) {
        return swal('Error', 'Something went wrong during the transaction', 'error')
      }

      this.props.updateWallet()

      return swal('Success', `${amount} SYS has been successfully sent to ${address}.`, 'success')
    })
  }

  updateFields(e, mode) {
    const { name, value } = e.target
    const newState = {...this.state}

    newState[mode][name] = value

    this.setState(newState)
  }

  generateAliasesOptions() {
    return this.props.currentAliases.filter(i => i.alias).map((i, key) => (
      <Option key={key} value={i.alias}>{i.alias}</Option>
    ))
  }

  render() {
    return (
      <Row>
        <Col
          xs={8}
          offset={8}
          style={{
            textAlign: 'center'
          }}
        >
          <div className='send-form'>
            <h3 className='white-text'>Send assets</h3>
            <Select
              onChange={e => this.setState({asset: {
                ...this.state.asset,
                selectedAlias: e
              }})}
              style={{width: '100%', marginBottom: 10}}
              placeholder='Select alias'
            >
              {this.generateAliasesOptions()}
            </Select>
            <Input name='assetId' placeholder='Asset ID' onChange={e => this.updateFields(e, 'asset')} value={this.state.asset.assetid}/>
            <Input name='toAddress' placeholder='Send to address...' onChange={e => this.updateFields(e, 'asset')} value={this.state.asset.toAddress}/>
            <Input name='amount' placeholder='Amount' pattern='\d+' onChange={e => this.updateFields(e, 'asset')} value={this.state.asset.amount}/>
            <div style={{textAlign: 'right', padding: '10px 0 10px 0'}}>
              <Button onClick={this.sendAsset.bind(this)}>Send</Button>
            </div>
          </div>
        </Col>
        <Col xs={24}>
          <hr />
        </Col>
        <Col
          xs={8}
          offset={8}
          style={{
            textAlign: 'center'
          }}
        >
          <div className='send-form'>
            <h3 className='white-text'>Send SYS</h3>
            <h4 className='white-text'>Current balance: {this.props.currentBalance}</h4>
            <Input name='toAddress' placeholder='Send to address...' onChange={e => this.updateFields(e, 'sys')} value={this.state.sys.toAddress}/>
            <Input name='amount' placeholder='Amount' pattern='\d+' onChange={e => this.updateFields(e, 'sys')} value={this.state.sys.amount}/>
            <Input name='comment' placeholder='Comment' onChange={e => this.updateFields(e, 'sys')} value={this.state.sys.comment}/>
            <div style={{textAlign: 'right', padding: '10px 0 10px 0'}}>
              <Button
                disabled={!this.state.sys.amount || !this.state.sys.toAddress}
                onClick={this.sendSys.bind(this)}
              >
                Send
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    )
  }
}
