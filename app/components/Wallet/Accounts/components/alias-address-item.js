// @flow
import React from 'react'
import { Row, Col } from 'antd'

type Props = {
  alias: string,
  address: string,
  isLoading: boolean,
  isSelected: boolean,
  updateSelectedAlias: Function
};

export default (props: Props) => {
  const { alias, address, isLoading, isSelected, updateSelectedAlias } = props
    return (
      <Row className={`alias-box ${isSelected ? 'expanded' : 'non-expanded'} ${isLoading ? 'loading' : ''}`} onClick={() => updateSelectedAlias(alias || address)}>
        {alias && (
          <Col xs={isSelected ? 6 : 4} offset={isSelected ? 1 : 0} className='alias-img-container'>
            <img className='alias-img' src={`https://ui-avatars.com/api/?name=${alias}&length=3&font-size=0.33&background=7FB2EC&color=FFFFFF`} alt='Alias' />
          </Col>
        )}
        <Col xs={16} className={`alias-text-container ${!alias ? 'address' : ''}`}>
          <div className='alias-name'>{alias || address}</div>
          <div className='alias-type'>{alias ? 'Alias' : 'Address'}</div>
        </Col>
      </Row>
    )
}
