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
  ownedTokens: Array<Object>,
  assetForm: Object,
  updateAsset: Function
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

  async updateAssetInfo(asset: number) {
    const { changeToolsAssetUpdateGuid, getAssetInfo, changeFormField } = this.props
    let assetInfo

    changeToolsAssetUpdateGuid(asset)

    try {
      assetInfo = await getAssetInfo(asset)
    } catch (err) {
      return
    }

    changeFormField({ field: 'publicValue', value: assetInfo.public_value })
    changeFormField({ field: 'contract', value: assetInfo.contract })
    changeFormField({ field: 'precision', value: assetInfo.precision })
    changeFormField({ field: 'supply', value: Number(assetInfo.total_supply) })
    changeFormField({ field: 'maxSupply', value: Number(assetInfo.max_supply) })
    changeFormField({ field: 'updateFlags', value: assetInfo.update_flags })
  }

  updateAsset() {
    const { updateAsset, assetForm, updateGuid } = this.props
    const toUpdate = {
      ...assetForm,
      assetGuid: updateGuid
    }

    return new Promise(async (resolve, reject) => {
      this.setState({ isLoading: true })

      try {
        await updateAsset(toUpdate)
      } catch (err) {
        this.setState({ isLoading: false })
        return reject(err)
      }

      this.setState({ isLoading: false })

      return resolve()
    })
  }

  render() {
    const { t, addresses, changeFormField, changeToolsAssetAction, formAction, updateGuid } = this.props
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
              isUpdate={false}
              t={t}
              addresses={addresses}
              createNewAsset={this.createNewAsset.bind(this)}
              form={this.props.assetForm}
              isLoading={this.state.isLoading}
              changeFormField={changeFormField}
            />
          )}
          {(formAction === 'update') && (
            <Select placeholder='Select an asset' onChange={value => this.updateAssetInfo(value)} value={updateGuid || undefined}>
              {this.props.ownedTokens.map(i => (
                <Option value={i.asset_guid} key={i.asset_guid}>{i.symbol}</Option>
              ))}
            </Select>
          )}
          {(formAction === 'update' && updateGuid !== 0) && (
            <div>
              <h4 className='asset-tools-update-asset-text'>Updating asset <span className='asset-tools-update-asset-number'>{updateGuid}</span></h4>
              <AssetForm
                isUpdate
                addresses={[]}
                createNewAsset={this.createNewAsset.bind(this)}
                isLoading={this.state.isLoading}
                form={this.props.assetForm}
                changeFormField={changeFormField}
                updateAsset={this.updateAsset.bind(this)}
                t={t}
              />
            </div>
          )}
        </Row>
      </div>
    )
  }
}
