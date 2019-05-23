// @flow
import React, { Component } from 'react'
import { Row, Col } from 'antd'

type Props = {
  t: Function
};

type State = {

};

export default class AssetUpdateForm extends Component<Props, State> {
  props: Props;

  constructor(props: Props) {
    super(props)

    this.state = {
      
    }
  }

  render() {
    const { t } = this.props
    return (
      <div className='asset-update-container'>
        
      </div>
    )
  }
}
