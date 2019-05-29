// @flow
import React, { Component } from 'react'
import { Row, Col, Input, Select, InputNumber, Button, Radio, Tooltip } from 'antd'
import swal from 'sweetalert'
import parseError from 'fw-utils/error-parser'
import FWTooltip from 'fw-components/General/Tooltip'

const { Option } = Select
const { Group } = Radio

type Props = {
  t: Function,
  addresses: Array<Object>,
  changeFormField: Function,
  isLoading: boolean,
  form: Object,
  isUpdate: boolean
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
    const { createNewAsset, updateAsset, isUpdate } = this.props

    if (isUpdate) {
      try {
        await updateAsset()
      } catch (err) {
        return swal('Error', parseError(err.message), 'error')
      }
  
      swal('Success', 'Asset updated successfully', 'success')
    } else {
      try {
        await createNewAsset()
      } catch (err) {
        return swal('Error', parseError(err.message), 'error')
      }
  
      swal('Success', 'Asset created successfully', 'success')
    }
  }

  render() {
    const { t, addresses, form, isLoading, isUpdate } = this.props
    const { address, symbol, publicValue, contract, precision, supply, maxSupply, updateFlags, witness } = form
    return (
      <div className='asset-create-container'>
        {!isUpdate && (
          <Select placeholder='Address' onChange={val => this.changeField(val, 'address')} value={address || undefined} disabled={isLoading}>
            {addresses.map(i => <Option value={i.address} key={i.address}>{i.label || i.address}</Option>)}
          </Select>
        )}
        {!isUpdate && (
          <Tooltip title='Symbol' trigger='focus' placement='right'>
            <Input placeholder='Symbol' onChange={e => this.changeField(e.target.value, 'symbol')} value={symbol || undefined} disabled={isLoading} />
          </Tooltip>
        )}
        <Tooltip title='Public value' trigger='focus' placement='right'>
          <Input placeholder='Public value' onChange={e => this.changeField(e.target.value, 'publicValue')} value={publicValue || undefined} disabled={isLoading} />
        </Tooltip>
        <Tooltip title='Contract' trigger='focus' placement='right'>
          <Input placeholder='Contract' onChange={e => this.changeField(e.target.value, 'contract')} value={contract || undefined} disabled={isLoading} />
        </Tooltip>

        {!isUpdate && (
          <Tooltip title='Precision' trigger='focus' placement='right'>
            <InputNumber placeholder='Precision (0-8)' min={0} max={8} onChange={val => this.changeField(val, 'precision')} value={precision || undefined} disabled={isLoading} />
          </Tooltip>
        )}
        <Tooltip title='Supply' trigger='focus' placement='right'>
          <InputNumber placeholder='Supply' min={0} onChange={val => this.changeField(val, 'supply')} value={supply || undefined} disabled={isLoading} />
        </Tooltip>
        {!isUpdate && (
          <Tooltip title='Max supply' trigger='focus' placement='right'>
            <InputNumber placeholder='Max supply' min={0} onChange={val => this.changeField(val, 'maxSupply')} value={maxSupply || undefined} disabled={isLoading} />
          </Tooltip>
        )}
        <div className='update-flags-container'>
          <h3>Permissions</h3>
          <Group name='updateFlags' style={{ display: 'block' }} value={updateFlags} onChange={e => this.changeField(e.target.value, 'updateFlags')}>
            <Row>
              <Col className='radio-buttons-container' xs={12}>
                <Radio value={1}>Admin <FWTooltip title='Gives admin status' placement='right' /></Radio>
                <Radio value={2}>Public <FWTooltip title='Can update public data field' placement='right' /></Radio>
                <Radio value={4}>Smart <FWTooltip title='Can update smart contract/burn method signature fields' placement='right' /></Radio>
              </Col>
              <Col className='radio-buttons-container' xs={12}>
                <Radio value={8}>Supply <FWTooltip title='Can update supply' placement='right' /></Radio>
                <Radio value={16}>Flags <FWTooltip title='Can update permissions' placement='right' /></Radio>
                <Radio value={31}>All <FWTooltip title='Grants all permissions' placement='right' /></Radio>
              </Col>
            </Row>
          </Group>
        </div>
        {!isUpdate && (
          <Tooltip title='Witness' trigger='focus' placement='right'>
            <Input placeholder='Witness' onChange={e => this.changeField(e.target.value, 'witness')} value={witness || undefined} disabled={isLoading} />
          </Tooltip>
        )}
        <Row>
          <Col xs={8} offset={16}>
            <Button className='asset-tools-send-button' onClick={this.onSubmit.bind(this)} disabled={isLoading}>Send</Button>
          </Col>
        </Row>
      </div>
    )
  }
}
