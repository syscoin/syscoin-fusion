// @flow
import React from 'react'
import { Row, Col } from 'antd'
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
    <Col xs={24}>
      <h4 className='asset-box-text'>
        {props.t('accounts.asset.available_assets')}
      </h4>
      <Row type="flex" justify="space-between">
        {props.assets.length ?
          props.assets.map(i => (
            <AssetBox
              isSelected={props.selectedAlias === i.asset}
              selectAsset={props.selectAsset}
              asset={i.asset.toString()}
              balance={i.balance}
              symbol={i.assetinfo.publicvalue.toUpperCase()}
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
    </Col>
  </Row>
)
