// @flow
import React, { Component } from 'react'
import { Row, Col, Icon, Spin, Tooltip } from 'antd'
import swal from 'sweetalert'
import parseError from 'fw-utils/error-parser'

type Props = {
  alias: string,
  address: string,
  isLoading: boolean,
  isSelected: boolean,
  updateSelectedAlias: Function,
  getPrivateKey: Function,
  avatarUrl: string
};

type State = {
  isLoading: boolean
};

class AliasAddressItem extends Component<Props, State> {

  constructor(props) {
    super(props)

    this.state = {
      isLoading: false
    }
  }

  getPrivateKey() {
    this.setState({ isLoading: true })
    this.props.getPrivateKey(this.props.address, (err, key) => {
      this.setState({ isLoading: false })
      if (err) {
        return swal('Error', parseError(err.message), 'error')
      }

      swal('Here is your key', key, 'success')
    })
  }

  render() {
    const { alias, address, isLoading, isSelected, updateSelectedAlias, avatarUrl } = this.props
    return (
      <Row
        className={`alias-box ${isSelected ? 'expanded' : 'non-expanded'} ${isLoading ? 'loading' : ''}`}
        onClick={() => {
          if (isSelected) {
            return
          }
          updateSelectedAlias(alias || address)
        }}
      >
        {alias && (
          <Col xs={isSelected ? 6 : 4} lg={isSelected ? 4 : 3} offset={isSelected ? 1 : 0} className='alias-img-container'>
            <img className='alias-img' src={avatarUrl.length ? avatarUrl : `https://ui-avatars.com/api/?name=${alias}&length=3&font-size=0.33&background=7FB2EC&color=FFFFFF`} alt='Alias' />
          </Col>
        )}
        <Col xs={alias ? 18 : 23} className={`alias-text-container ${!alias ? 'address' : ''}`}>
          <div className='alias-name'>
            {alias || address}
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
          <div className='alias-type'>{alias ? 'Alias' : 'Address'}</div>
        </Col>
      </Row>
    )
  }
}

export default AliasAddressItem