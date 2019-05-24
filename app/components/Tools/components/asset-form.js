// @flow
import React, { Component } from 'react'
import { Row, Col, Input, Select, InputNumber, Button } from 'antd'
import swal from 'sweetalert'
import parseError from 'fw-utils/error-parser'

const { Option } = Select

type Props = {
  t: Function,
  addresses: Array<Object>,
  changeFormField: Function,
  isLoading: boolean,
  form: Object
};

export default class AssetForm extends Component<Props> {
  props: Props;

  changeField(value, field) {
    this.props.changeFormField({
      field,
      value: this.filterValue(value, field)
    })
  }

  filterValue(value, field) {
    const onlyNumbers = /[^0-9]/g
    const numberFields = [
      'precision',
      'supply',
      'maxSupply',
      'updateFlags'
    ]

    if (numberFields.indexOf(field) !== -1) {
      return Number(value.toString().replace(onlyNumbers, ''))
    }

    return value
  }

  async onSubmit() {
    const { createNewAsset } = this.props

    try {
      await createNewAsset()
    } catch (err) {
      return swal('Error', parseError(err.message), 'error')
    }

    swal('Success', 'Asset created successfully', 'success')
  }

  render() {
    const { t, addresses, form, isLoading } = this.props
    const { address, symbol, publicValue, contract, precision, supply, maxSupply, updateFlags, witness } = form
    return (
      <div className='asset-create-container'>
        <Select placeholder='Address' onChange={val => this.changeField(val, 'address')} value={address || undefined} disabled={isLoading}>
          {addresses.map(i => <Option value={i.address} key={i.address}>{i.label || i.address}</Option>)}
        </Select>
        <Input placeholder='Symbol' onChange={e => this.changeField(e.target.value, 'symbol')} value={symbol || undefined} disabled={isLoading} />
        <Input placeholder='Public value' onChange={e => this.changeField(e.target.value, 'publicValue')} value={publicValue || undefined} disabled={isLoading} />
        <Input placeholder='Contract' onChange={e => this.changeField(e.target.value, 'contract')} value={contract || undefined} disabled={isLoading} />
        <InputNumber placeholder='Precision (0-8)' min={0} max={8} onChange={val => this.changeField(val, 'precision')} value={precision || undefined} disabled={isLoading} />
        <InputNumber placeholder='Supply' min={0} onChange={val => this.changeField(val, 'supply')} value={supply || undefined} disabled={isLoading} />
        <InputNumber placeholder='Max supply' min={0} onChange={val => this.changeField(val, 'maxSupply')} value={maxSupply || undefined} disabled={isLoading} />
        <Select placeholder='Update flags' onChange={val => this.changeField(val, 'updateFlags')} value={updateFlags || undefined} disabled={isLoading}>
          <Option value={1}>0x01 (1)</Option>
          <Option value={2}>0x10 (2)</Option>
          <Option value={3}>0x100 (4)</Option>
          <Option value={8}>0x1000 (8)</Option>
          <Option value={16}>0x10000 (16)</Option>
          <Option value={31}>0x11111 (31)</Option>
        </Select>
        <Input placeholder='Witness' onChange={e => this.changeField(e.target.value, 'witness')} value={witness || undefined} disabled={isLoading} />
        <Row>
          <Col xs={8} offset={16}>
            <Button className='asset-tools-send-button' onClick={this.onSubmit.bind(this)} disabled={isLoading}>Send</Button>
          </Col>
        </Row>
      </div>
    )
  }
}
