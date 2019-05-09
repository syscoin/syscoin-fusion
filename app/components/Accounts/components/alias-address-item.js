// @flow
import React, { Component } from 'react'
import { Row, Col, Icon, Spin, Tooltip } from 'antd'
import swal from 'sweetalert'
import parseError from 'fw-utils/error-parser'

type Props = {
  address: string,
  isLoading: boolean,
  isSelected: boolean,
  label: string,
  updateSelectedAlias: Function,
  getPrivateKey: Function,
  t: Function
};

type State = {
  isLoading: boolean
};

class AliasAddressItem extends Component<Props, State> {

  constructor(props: Props) {
    super(props)

    this.state = {
      isLoading: false
    }
  }

  getPrivateKey() {
    const { t } = this.props

    this.setState({ isLoading: true })
    this.props.getPrivateKey(this.props.address, (err, key) => {
      this.setState({ isLoading: false })
      if (err) {
        return swal(t('misc.error'), parseError(err.message), 'error')
      }

      swal(t('accounts.panel.get_private_key_success'), key, 'success')
    })
  }

  render() {
    const { address, isLoading, isSelected, label, updateSelectedAlias, t } = this.props
    return (
      <Row
        className={`alias-box ${isSelected ? 'expanded' : 'non-expanded'} ${isLoading ? 'loading' : ''}`}
        onClick={() => {
          if (isSelected) {
            return
          }
          updateSelectedAlias(address)
        }}
      >
        <Col xs={23} className='alias-text-container address'>
          <div className='alias-name'>
            {label || address}
            {isSelected && (
              <div className='alias-toolbox'>
                {
                  this.state.isLoading ?
                    <Spin indicator={<Icon type='loading' spin />} /> :
                    <div>
                      <Tooltip title='Get private key'>
                        <Icon type='key' onClick={this.getPrivateKey.bind(this)} />
                      </Tooltip>
                    </div>
                }
              </div>
            )}
          </div>
          <div className='alias-type'>{t('misc.address')}</div>
        </Col>
      </Row>
    )
  }
}

export default AliasAddressItem