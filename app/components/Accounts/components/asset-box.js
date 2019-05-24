// @flow
import React, { Component } from 'react'
import { Col, Icon } from 'antd'
import SendButton from './send-button'

type Props = {
  isSelected: boolean,
  isOwner: boolean,
  selectAsset: Function,
  asset: string,
  symbol: string,
  balance: string,
  goToSendAssetForm: Function,
  t: Function
};

export default class AssetBox extends Component<Props> {
  render() {
    const { isSelected, isOwner, selectAsset, asset, symbol, balance, goToSendAssetForm, t } = this.props
    return (
      <Col
        xs={11}
        className={`asset-box ${isSelected ? 'selected' : ''}`}
        key={Math.random()}
        onClick={() => selectAsset({ asset, symbol })}
      >
        <h3 className='asset-box-name'>{symbol}</h3>
        <h5 className='asset-box-guid'>{asset}</h5>
        <h4 className='asset-box-balance'>{t('misc.balance')}: {Number(balance).toFixed(2)}</h4>
        {isOwner ? <Icon className='asset-box-crown' type='star' /> : null}
        <SendButton className='asset-box-send' onClick={() => goToSendAssetForm(asset)} t={t} />
      </Col>
    )
  }
}