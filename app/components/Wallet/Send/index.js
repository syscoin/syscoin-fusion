// @flow
import React, { Component } from 'react'
// import { Link } from 'react-router-dom'
import { Row, Col, Input, Button, Select } from 'antd'
import swal from 'sweetalert'
import {
  getAssetInfo,
  sendAsset
} from '../../../utils/sys-helpers'


type Props = {
  currentAliases: Array<Object>
};
type State = {
  selectedAlias: string,
  assetId: string,
  toAddress: string,
  amount: string
};

const Option = Select.Option

export default class Send extends Component<Props, State> {
  props: Props;
  
  constructor(props) {
    super(props)

    this.state = {
      selectedAlias: '',
      assetId: '',
      toAddress: '',
      amount: ''
    }
  }

  isUserAssetOwner(cb) {
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

      return cb(null, true)
    })
  }

  sendAsset() {
    const { selectedAlias: fromAlias, toAddress: toAlias, assetId, amount } = this.state

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

  updateFields(e) {
    const { name, value } = e.target
    const newState = {...this.state}

    newState[name] = value

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
              onChange={e => this.setState({selectedAlias: e})}
              style={{width: '100%', marginBottom: 10}}
              placeholder='Select alias'
            >
              {this.generateAliasesOptions()}
            </Select>
            <Input name='assetId' placeholder='Asset ID' onChange={this.updateFields.bind(this)}/>
            <Input name='toAddress' placeholder='Send to address...' onChange={this.updateFields.bind(this)}/>
            <Input name='amount' placeholder='Amount' pattern='\d+' onChange={this.updateFields.bind(this)}/>
            <div style={{textAlign: 'right', padding: '10px 0 10px 0'}}>
              <Button onClick={this.sendAsset.bind(this)}>Send</Button>
            </div>
          </div>
        </Col>
      </Row>
    )
  }
}
