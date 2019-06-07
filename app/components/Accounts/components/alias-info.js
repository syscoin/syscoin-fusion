// @flow
import React, { Component } from 'react'
import { Row, Col } from 'antd'
import QRcode from 'qrcode'

type Props = {
  t: Function,
  address: string,
  balance: number
};

const extractAvatar = async (alias: string) => {
  let url
  try {
    url =  await QRcode.toDataURL(alias, { margin: 2 })
  } catch(err) {
    return `https://ui-avatars.com/api/?name=${alias}&length=3&font-size=0.33&background=7FB2EC&color=FFFFFF`
  }

  return url
}

export default class AliasInfo extends Component<Props> {

  constructor(props: Props) {
    super(props)

    this.state = {
      avatar: ''
    }
  }

  async componentWillMount() {
    const avatar = await extractAvatar(this.props.address)

    this.setState({
      avatar
    })
  }

  render() {
    const { address, t, balance } = this.props
    return (
      <Row className='alias-info-container'>
        <Col xs={18}>
          <div className='alias-info-text-container'>
            <h3>{t('accounts.asset.alias_information')}</h3>
            <hr />
            <p><span className='blue-text'>{t('misc.address')}</span>:</p>
            <p>{address}</p>
            <p><span className='blue-text'>{t('misc.balance')}</span>: {balance} SYS</p>
          </div>
        </Col>
        <Col xs={6}>
          <img
            alt='address-avatar'
            className='alias-info-alias-avatar'
            src={this.state.avatar}
          />
        </Col>
      </Row>    
    )
  }
}
