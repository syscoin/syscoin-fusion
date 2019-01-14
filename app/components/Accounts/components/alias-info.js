// @flow
import React, { Component } from 'react'
import { Row, Col, Icon, Spin, Tooltip } from 'antd'

type Props = {
  t: Function,
  isAlias: boolean,
  alias: string,
  address: string,
  balance: number,
  avatarUrl: string | undefined
};

const extractAvatar = (alias: string) => {
  return `https://ui-avatars.com/api/?name=${alias}&length=3&font-size=0.33&background=7FB2EC&color=FFFFFF`
}

export default (props: Props) => (
  <Row className='alias-info-container'>
    <Col xs={18}>
      <div className='alias-info-text-container'>
        <h3>{props.t('accounts.asset.alias_information')}</h3>
        <hr />
        {props.isAlias && <p><span className='blue-text'>{props.t('misc.alias')}</span>: {props.alias}</p>}
        <p><span className='blue-text'>{props.t('misc.address')}</span>: {props.address}</p>
        <p><span className='blue-text'>{props.t('misc.balance')}</span>: {props.balance} SYS</p>
      </div>
    </Col>
    <Col xs={6}>
      <img
        className='alias-info-alias-avatar'
        src={props.avatarUrl ? props.avatarUrl : extractAvatar(props.alias || props.address)}
      />
    </Col>
  </Row>
)
