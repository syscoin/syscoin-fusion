// @flow
import React, { Component } from 'react'
import { Row, Col, Icon, Spin, Tooltip } from 'antd'
import AssetBox from './asset-box'

type Props = {
  assets: Array<Object>,
  selectedAsset: string,
  selectAsset: Function,
  goToSendAssetForm: Function,
  claimInterest: Function,
  t: Function
};

export default (props: Props) => (
  <Row className='asset-box-container'>
    <h4 className='asset-box-text'>
      {props.t('accounts.asset.available_assets')}
    </h4>
    {props.assets.length ?
      props.assets.map(i => (
        <AssetBox
          isSelected={props.selectedAlias === i.asset}
          selectAsset={props.selectAsset}
          asset={i.asset}
          balance={i.balance}
          symbol={i.symbol}
          key={i.asset}
          goToSendAssetForm={props.goToSendAssetForm}
          selectedAlias={props.selectedAlias}
          claimInterest={props.claimInterest}
          canClaimInterest={i.interest_rate > 0}
          t={props.t}
        />
      )) : (
        <Col
          xs={10}
          offset={1}
        >
          <span className='available-assets-no-asset'>{props.t('accounts.asset.no_available_assets')}</span>
        </Col>
      )
    }
  </Row>
)
