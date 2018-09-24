// @flow
import React from 'react'
import { Col } from 'antd'

type Props = {
  isSelected: boolean,
  selectAsset: Function,
  asset: string,
  symbol: string,
  balance: string
};

export default (props: Props) => {
  const { isSelected, selectAsset, asset, symbol, balance } = props
  return (
    <Col
      xs={10}
      offset={1}
      className={`asset-box ${isSelected ? 'selected' : ''}`}
      key={asset}
      onClick={() => selectAsset(asset)}
    >
      <h3 className='asset-box-name'>{symbol}</h3>
      <h5 className='asset-box-guid'>{asset}</h5>
      <h4 className='asset-box-balance'>Balance: {Number(balance).toFixed(2)}</h4>
    </Col>
  )
}
