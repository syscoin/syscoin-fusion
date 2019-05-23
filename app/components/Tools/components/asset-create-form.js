// @flow
import React, { Component } from 'react'
import { Row, Col, Input, Select, InputNumber, Button } from 'antd'

const { Option } = Select

type Props = {
  t: Function
};

type State = {

};

export default class AssetCreateForm extends Component<Props, State> {
  props: Props;

  constructor(props: Props) {
    super(props)

    this.state = {
      
    }
  }

  render() {
    const { t } = this.props
    return (
      <div className='asset-create-container'>
      </div>
    )
  }
}
