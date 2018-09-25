// @flow
import React, { Component } from 'react'
// import { Link } from 'react-router-dom'
import { Row, Col, Input, Button, Select, Spin, Icon } from 'antd'
import swal from 'sweetalert'
import {
  getAssetAllocationInfo,
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
    fromType: number,
    fromAddress: string,
    selectedAlias: string,
    assetId: string,
    toAddress: string,
    amount: string,
    isLoading: boolean
  },
  sys: {
    toAddress: string,
    amount: string,
    comment: string,
    isLoading: boolean
  }
};

const { Option } = Select

export default class Send extends Component<Props, State> {
  props: Props;
  
  constructor(props: Props) {
    super(props)

    this.stateSchema = {
      asset: {
        // 0: none, 1: address, 2: alias
        fromType: 0,
        fromAddress: '',
        selectedAlias: '',
        assetId: '',
        toAddress: '',
        amount: '',
        isLoading: false
      },
      sys: {
        toAddress: '',
        amount: '',
        comment: '',
        isLoading: false
      }
    }

    this.state = {...this.stateSchema}
  }

  isUserAssetOwner(cb: Function) {
    const { selectedAlias: fromAlias, fromType, fromAddress } = this.state.asset
    const from = fromType === 1 ? fromAddress : fromAlias

    getAssetAllocationInfo({
      assetId: this.state.asset.assetId,
      aliasName: from
    }, (err) => {
      if (err) {
        return cb(true)
      }

      return cb(null)
    })
  }

  sendAsset() {
    const { selectedAlias: fromAlias, toAddress: toAlias, assetId, amount, fromType, fromAddress } = this.state.asset
    const from = fromType === 1 ? fromAddress : fromAlias

    this.setState({
      asset: {
        ...this.state.asset,
        isLoading: true
      }
    })

    this.isUserAssetOwner((err) => {
      if (err) {
        this.setState({
          asset: {
            ...this.state.asset,
            isLoading: false
          }
        })
        return swal('Error', 'You do not own that asset.', 'error')
      }

      sendAsset({
        fromAlias: from,
        toAlias,
        assetId,
        amount
      }, (errSend) => {

        this.setState({
          asset: {
            ...this.state.asset,
            isLoading: false
          }
        })

        if (errSend) {
          return swal('Error', 'Error while sending the asset.', 'error')
        }

        this.cleanFields()

        swal('Success', 'Asset sent.', 'success')
      })
    })
  }

  sendSys() {
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

      this.props.updateWallet()

      return swal('Success', `${amount} SYS has been successfully sent to ${address}.`, 'success')
    })
  }

  updateFields(e: Object, mode: string) {
    const { name, value } = e.target
    const newState = {...this.state}

    newState[mode][name] = value

    this.setState(newState)
  }

  generateAliasesOptions() {
    return this.props.currentAliases.filter(i => i.alias).map((i) => (
      <Option key={i} value={i.alias}>{i.alias}</Option>
    ))
  }

  cleanFields() {
    this.setState({
      ...this.stateSchema
    })
  }

  generateAssetsOptions() {
    return (
      <Select
        defaultValue='Asset ID'
        onChange={e => this.setState({asset: {
          ...this.state.asset,
          assetId: e
        }})}
        placeholder='Asset'
        className='send-asset-form-control send-asset-form-asset-id'
        value={this.state.asset.assetId}
      >
        <Option value=''>
            Asset ID
        </Option>
        {global.appStorage.get('guid').map(i => (
          <Option value={i} key={i}>
            {i}
          </Option>
        ))}
      </Select>
    )
  }

  render() {
    return (
      <Row gutter={24}>
        <Col
          xs={12}
          className='send-asset-container'
          style={{
            padding: '40px 40px 40px 80px'
          }}
        >
          <div className='send-asset-form-container'>
            <h3 className='send-asset-form-title'>Send assets</h3>
            <Select
              onChange={e => this.setState({asset: {
                ...this.state.asset,
                fromType: e
              }})}
              placeholder='Send from'
              className='send-asset-form-control send-asset-form-type-from'
            >
              <Option value={1}>Address</Option>
              <Option value={2}>Alias</Option>
            </Select>
            {this.state.asset.fromType === 2 && (
              <Select
                onChange={e => this.setState({asset: {
                  ...this.state.asset,
                  selectedAlias: e
                }})}
                placeholder='Select alias'
                className='send-asset-form-control send-asset-form-select-alias'
              >
                {this.generateAliasesOptions()}
              </Select>
            )}
            {this.state.asset.fromType === 1 && (
              <Input
                name='fromAddress'
                placeholder='Address'
                onChange={e => this.updateFields(e, 'asset')}
                value={this.state.asset.fromAddress}
                className='send-asset-form-control send-asset-form-from-address'
              />
            )}
            {global.appStorage.get('guid').length ? this.generateAssetsOptions() : (
              <Input
                name='assetId'
                placeholder='Asset ID'
                onChange={e => this.updateFields(e, 'asset')}
                value={this.state.asset.assetId}
                className='send-asset-form-control send-asset-form-asset-id'
              />
            )}
            <Input
              name='toAddress'
              placeholder='Send to address...'
              onChange={e => this.updateFields(e, 'asset')}
              value={this.state.asset.toAddress}
              className='send-asset-form-control send-asset-form-to-address'
            />
            <Input
              name='amount'
              placeholder='Amount'
              pattern='\d+'
              onChange={e => this.updateFields(e, 'asset')}
              value={this.state.asset.amount}
              className='send-asset-form control send-asset-form-asset'
            />
            <div className='send-asset-form-btn-container'>
              {this.state.asset.isLoading && <Spin indicator={<Icon type='loading' spin />} className='send-loading' />}
              <Button
                className='send-asset-form-btn-send'
                disabled={this.state.asset.isLoading}
                onClick={this.sendAsset.bind(this)}
              >
                Send
              </Button>
            </div>
          </div>
        </Col>
        <Col
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
        </Col>
      </Row>
    )
  }
}
