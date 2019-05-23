// @flow
import React, { Component } from 'react'
import { Row, Col, Select } from 'antd'
import AssetForm from './asset-form'
// import AssetCreateForm from './asset-create-form'
// import AssetUpdateForm from './asset-update-form'

const { Option } = Select

type Props = {
  t: Function,
  formAction: string,
  updateGuid: number,
  changeToolsAssetAction: Function,
  changeToolsAssetUpdateGuid: Function
};

type State = {

};

export default class AssetToolsForm extends Component<Props, State> {
  props: Props;

  constructor(props: Props) {
    super(props)

    this.state = {
      
    }
  }

  render() {
    const { t, changeToolsAssetAction, changeToolsAssetUpdateGuid, formAction, updateGuid } = this.props
    return (
      <div className='asset-tools-container'>
        <Row>
          <Col xs={24}>
            <Select placeholder='I want to...' onChange={value => changeToolsAssetAction(value)} value={formAction || undefined}>
              <Option value='create'>Create an asset</Option>
              <Option value='update'>Update an asset</Option>
            </Select>
          </Col>
          {formAction === 'create' && <AssetForm t={t} onSubmit={() => console.log('submit!')} />}
          {(formAction === 'update') && (
            <Select placeholder='Select an asset' onChange={value => changeToolsAssetUpdateGuid(Number(value))} value={updateGuid || undefined}>
              <Option value={12345}>GUID 1</Option>
              <Option value={23456}>GUID 2</Option>
              <Option value={34567}>GUID 3</Option>
            </Select>
          )}
          {(formAction === 'update' && updateGuid !== 0) && (
            <div>
              <h4 className='asset-tools-update-asset-text'>Updating asset <span className='asset-tools-update-asset-number'>{updateGuid}</span></h4>
              <AssetForm t={t} onSubmit={() => console.log('submit!')} />
            </div>
          )}
        </Row>
      </div>
    )
  }
}
