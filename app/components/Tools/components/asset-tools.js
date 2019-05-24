// @flow
import React, { Component } from 'react'
import { Row, Col, Select } from 'antd'
import AssetForm from './asset-form'
// import AssetCreateForm from './asset-create-form'
// import AssetUpdateForm from './asset-update-form'

const { Option } = Select

type Props = {
  t: Function,
  addresses: Array<Object>,
  changeFormField: Function,
  createNewAsset: Function,
  formAction: string,
  updateGuid: number,
  changeToolsAssetAction: Function,
  changeToolsAssetUpdateGuid: Function,
  assetForm: Object
};

type State = {

};

export default class AssetToolsForm extends Component<Props, State> {
  props: Props;

  constructor(props: Props) {
    super(props)

    this.state = {
      isLoading: false
    }
  }

  createNewAsset() {
    const { assetForm, createNewAsset } = this.props

    return new Promise(async (resolve, reject) => {
      this.setState({ isLoading: true })

    try {
      await createNewAsset(assetForm)
    } catch (err) {
      this.setState({ isLoading: false })
      return reject(err)
    }

    this.setState({ isLoading: false })

    return resolve()
    })
  }

  render() {
    const { t, addresses, changeFormField, changeToolsAssetAction, changeToolsAssetUpdateGuid, formAction, updateGuid } = this.props
    return (
      <div className='asset-tools-container'>
        <Row>
          <Col xs={24}>
            <Select placeholder='I want to...' onChange={value => changeToolsAssetAction(value)} value={formAction || undefined}>
              <Option value='create'>Create an asset</Option>
              <Option value='update'>Update an asset</Option>
            </Select>
          </Col>
          {formAction === 'create' && (
            <AssetForm
              t={t}
              addresses={addresses}
              createNewAsset={this.createNewAsset.bind(this)}
              form={this.props.assetForm}
              isLoading={this.state.isLoading}
              changeFormField={changeFormField}
            />
          )}
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
              <AssetForm
                t={t}
                createNewAsset={this.createNewAsset.bind(this)}
                isLoading={this.state.isLoading}
                form={this.props.assetForm}
                changeFormField={changeFormField}
              />
            </div>
          )}
        </Row>
      </div>
    )
  }
}
