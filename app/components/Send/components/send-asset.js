// @flow
import React, { Component } from 'react'
import { Input, Button, Select, Spin, Icon } from 'antd'
import formChangeFormat from 'fw-utils/form-change-format'

const { Option } = Select

type Props = {
  addresses: Array<Object>,
  isLoading: boolean,
  isSegwit: Function,
  sendAsset: Function,
  onSelectAlias: Function,
  assetsFromAlias: {
    isLoading: boolean,
    error: boolean,
    data: Array<Object>
  },
  form: {
    isLoading: boolean,
    error: boolean,
    data: FormDataType
  },
  onChangeForm: Function,
  t: Function
};

type FormDataType = {
  from: string,
  asset: string,
  toAddress: string,
  amount: string
};

export default class SendAssetForm extends Component<Props> {

  updateField(value: string | Object, name: string, filter?: RegExp) {
    const toUpdate = formChangeFormat(value, name, filter)

    if (filter && !filter.test(toUpdate[name])) {
      if (toUpdate[name]) {
        return
      }
    }

    this.props.onChangeForm({
      ...this.props.form.data,
      ...toUpdate
    }, 'asset')
  }
  
  resetForm() {
    this.props.onChangeForm({
      ...this.initialState
    })
  }

  selectedAssetBalance() {
    try {
      return this.getSelectedAsset().balance
    } catch(err) {
      return ''
    }
  }

  getSelectedAsset() {
    try {
      return this.props.assetsFromAlias.data.find(i => (
        i.isOwner ?
        i.asset_guid.toString().concat('-owner') === this.props.form.data.asset
        : i.asset_guid.toString() === this.props.form.data.asset
      ))
    } catch(err) {
      return ''
    }
  }

  prepareAddresses() {
    return this.props.addresses.filter(i => this.props.isSegwit(i.address))
  }

  prepareSubmit() {
    const { form, sendAsset } = this.props
    this.updateField(form.data.asset.replace('-owner', ''), 'asset')

    setTimeout(() => {
      sendAsset()
    }, 100)
  }
  
  render() {
    const { t } = this.props
    const {
      isLoading = false,
      assetsFromAlias,
      form
    } = this.props
    const {
      from,
      asset,
      toAddress,
      amount
    } = form.data

    return (
      <div
        className='send-asset-container'
      >
        <div className='send-asset-form-container'>
          <Select
            disabled={isLoading}
            onChange={val => {
              this.updateField(val, 'from')

              this.props.onSelectAlias(val)

              // Give some time to updateField to update "from" so it wont be empty when firing this
              setTimeout(() => this.updateField('', 'asset'), 200)
            }}
            placeholder={t('send.send_asset.select_alias')}
            className='send-asset-form-control send-asset-form-select-alias'
            id='asset-form-select-alias'
            value={from.length ? from : undefined}
          >
            {this.prepareAddresses().map(i => (
              <Option value={i.address} key={i.address}>
                {i.label || i.address}
              </Option>
            ))}
          </Select>
          <Select
            disabled={isLoading || assetsFromAlias.isLoading}
            onChange={val => this.updateField(val, 'asset')}
            placeholder={t('send.send_asset.select_asset')}
            className='send-asset-form-control send-asset-form-select-asset'
            id='asset-form-select-asset'
            value={asset.length ? asset : undefined}
          >
            {assetsFromAlias.data.map(i => (
              <Option value={`${i.asset_guid.toString()}${i.isOwner ? '-owner' : ''}`} key={`${i.asset_guid}${i.isOwner ? '-owner' : ''}`}>
                {i.symbol}{i.isOwner ? <span>{' '}<Icon className='send-star-icon' type='star' /></span> : ''} - {i.asset_guid}
              </Option>
            ))}
          </Select>
          {asset.length && !assetsFromAlias.isLoading ? (
            <div className='asset-form-asset-balance'>
              <p>Balance: <span className='blue-text'>{this.selectedAssetBalance()}</span></p>
            </div>
          ) : null}
          {assetsFromAlias.isLoading && <Spin indicator={<Icon type='loading' spin />} className='assets-from-alias-loader' />}
          <Input
            disabled={isLoading}
            name='toAddress'
            placeholder={t('send.send_asset.send_to')}
            onChange={e => this.updateField(e, 'toAddress')}
            value={toAddress}
            className='send-asset-form-control send-asset-form-to-address'
            id='asset-form-to-address'
          />
          <Input
            disabled={isLoading}
            name='amount'
            placeholder={t('send.send_asset.amount')}
            onChange={e => this.updateField(e, 'amount', /^\d+(\.)?(\d+)?$/)}
            value={amount}
            className='send-asset-form control send-asset-form-amount'
            id='asset-form-amount'
          />
          <div className='send-asset-form-btn-container'>
            {isLoading && <Spin indicator={<Icon type='loading' spin />} className='send-loading' />}
            <Button
              className='send-asset-form-btn-send'
              disabled={isLoading || !from || !asset || !toAddress || !amount}
              onClick={() => this.prepareSubmit()}
            >
              {t('misc.send')}
            </Button>
          </div>
        </div>
      </div>
    )
  }
}
