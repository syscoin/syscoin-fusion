// @flow
import React, { Component } from 'react'
import { Row, Col, Icon, Spin, Tooltip } from 'antd'
import swal from 'sweetalert2'
import parseError from 'fw-utils/error-parser'

type Props = {
  address: string,
  isLoading: boolean,
  isSelected: boolean,
  editLabel: Function,
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

  async editLabel() {
    // const { t } = this.props

    const label = await swal({
      title: 'Edit label',
      input: 'text',
      inputPlaceholder: 'New label',
      allowOutsideClick: true,
      allowEscapeKey: true,
      showCancelButton: true
    })

    if (label.dismiss) {
      return
    }

    this.setState({ isLoading: true })

    try {
      await this.props.editLabel(this.props.address, label.value)
    } catch (err) {
      this.setState({ isLoading: false })
      return swal('Error', parseError(err.message), 'error')
    }

    this.setState({ isLoading: false })

    swal('Success', '', 'success')
  }

  render() {
    const { address, isLoading, isSelected, label, updateSelectedAlias } = this.props
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
            <span className='trim'>
              {label || address}
            </span>
            {isSelected && (
              <div className='alias-toolbox'>
                {
                  this.state.isLoading ?
                    <Spin indicator={<Icon type='loading' spin />} /> :
                    <div>
                      <Tooltip title='Edit address label'>
                        <Icon type='edit' onClick={this.editLabel.bind(this)} />
                      </Tooltip>
                      <Tooltip title='Get private key'>
                        <Icon type='key' onClick={this.getPrivateKey.bind(this)} />
                      </Tooltip>
                    </div>
                }
              </div>
            )}
          </div>
        </Col>
      </Row>
    )
  }
}

export default AliasAddressItem