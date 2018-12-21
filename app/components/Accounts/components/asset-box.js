// @flow
import React, { Component } from 'react'
import { Col, Dropdown, Menu, Icon } from 'antd'
import SendButton from './send-button'
import swal from 'sweetalert'
import parseError from 'fw-utils/error-parser'

type Props = {
  isSelected: boolean,
  selectAsset: Function,
  asset: string,
  symbol: string,
  balance: string,
  goToSendAssetForm: Function,
  claimInterest: Function,
  selectedAlias: string,
  canClaimInterest: boolean,
  t: Function
};

const { Item } = Menu

export default class AssetBox extends Component<Props> {

  async claimInterest() {
    const { t } = this.props
    try {
      await this.props.claimInterest(this.props.asset, this.props.selectedAlias)
    } catch(err) {
      return swal('Error', parseError(err.message), 'error')
    }

    swal(t('misc.success'), t('misc.claim_interest_success'), 'success')
  }

  render() {
    const { isSelected, selectAsset, asset, symbol, balance, goToSendAssetForm, canClaimInterest, t } = this.props

    const menu = (
      <Menu>
        <Item key='0' onClick={this.claimInterest.bind(this)} disabled={!canClaimInterest}>{t('misc.claim_interest')}</Item>
      </Menu>
    )
    return (
      <Col
        xs={10}
        offset={1}
        className={`asset-box ${isSelected ? 'selected' : ''}`}
        key={asset}
        onClick={() => selectAsset({ asset, symbol })}
      >
        <h3 className='asset-box-name'>{symbol}</h3>
        <h5 className='asset-box-guid'>{asset}</h5>
        <h4 className='asset-box-balance'>{t('misc.balance')}: {Number(balance).toFixed(2)}</h4>
        <Dropdown overlay={menu} trigger={['click']}>
          <Icon type='setting' className='asset-box-settings' />
        </Dropdown>
        <SendButton className='asset-box-send' onClick={() => goToSendAssetForm(asset)} />
      </Col>
    )
  }
}