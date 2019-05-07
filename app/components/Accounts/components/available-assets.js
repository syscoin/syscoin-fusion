// @flow
import React from 'react'
import { Row, Col } from 'antd'
import AssetBox from './asset-box'

type Props = {
  assets: Array<Object>,
  selectedAsset: string,
  selectAsset: Function,
  goToSendAssetForm: Function,
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
              isSelected={props.selectedAsset === i.asset_guid.toString()}
              selectAsset={props.selectAsset}
              asset={i.asset_guid.toString()}
              balance={i.balance}
              symbol={i.publicvalue.toUpperCase()}
              key={i.asset_guid}
              goToSendAssetForm={props.goToSendAssetForm}
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
