// @flow
import React, { Component } from 'react'
import { Row, Col, Input, Select, InputNumber, Button } from 'antd'

const { Option } = Select

type Props = {
  t: Function,
  onSubmit: Function
};

type State = {

};

export default class AssetForm extends Component<Props, State> {
  props: Props;

  constructor(props: Props) {
    super(props)

    this.state = {
      
    }
  }

  render() {
    const { t, onSubmit } = this.props
    return (
      <div className='asset-create-container'>
        <Select placeholder='Address'>
          <Option value='a'>Address 1</Option>
          <Option value='b'>Address 2</Option>
          <Option value='c'>Address 3</Option>
        </Select>
        <Input placeholder='Symbol' />
        <Input placeholder='Public value' />
        <Input placeholder='Contract' />
        <InputNumber placeholder='Precision (0-8)' min={0} max={8} />
        <InputNumber placeholder='Supply' min={0} />
        <InputNumber placeholder='Max supply' min={0} />
        <Select placeholder='Update flags'>
          <Option value='a'>0x01 (1)</Option>
          <Option value='b'>0x10 (2)</Option>
          <Option value='c'>0x100 (4)</Option>
          <Option value='a'>0x1000 (8)</Option>
          <Option value='b'>0x10000 (16)</Option>
          <Option value='c'>0x11111 (31)</Option>
        </Select>
        <Input placeholder='Witness' />
        <Row>
          <Col xs={8} offset={16}>
            <Button className='asset-tools-send-button' onClick={onSubmit}>Send</Button>
          </Col>
        </Row>
      </div>
    )
  }
}
