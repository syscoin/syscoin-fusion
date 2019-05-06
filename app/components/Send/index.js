// @flow
import React, { Component } from 'react'
import { Row, Col, Collapse, Icon } from 'antd'
import swal from 'sweetalert'

import parseError from 'fw-utils/error-parser'
import SendAssetForm from './components/send-asset'
import SendSysForm from './components/send-sys'

const { Panel } = Collapse

type Props = {
  aliases: Array<string>,
  sendAsset: Function,
  sendSys: Function,
  balance: number,
  getAssetsFromAlias: Function,
  assetsForm: {
    data: sendAssetType,
    isLoading: boolean,
    error: boolean,
    states: {
      assetsFromAlias: {
        isLoading: boolean,
        error: boolean,
        data: Array<Object>
      }
    }
  },
  sysForm: {
    data: sendSysType,
    isLoading: boolean,
    error: boolean
  },
  onChangeForm: Function,
  activeTab: string,
  t: Function
};

type sendAssetType = {
  from: string,
  asset: string,
  toAddress: string,
  amount: string,
  comment?: string
};

type sendSysType = {
  amount: string,
  address: string,
  comment: string
};

export default class Send extends Component<Props> {

  async sendSys(obj: sendSysType) {
    const { t } = this.props
    try {
      await this.props.sendSys(obj)
    } catch (err) {
      return swal(t('misc.error'), parseError(err.message), 'error')
    }

    swal(t('misc.success'), t('send.send_sys.sys_send_success'), 'success')
  }

  async sendAsset() {
    const { t } = this.props
    try {
      await this.props.sendAsset()
    } catch (err) {
      return swal(t('misc.error'), parseError(err.message), 'error')
    }

    swal(t('misc.success'), t('send.send_asset.asset_send_success'), 'success')
  }

  changeTab(tab) {
    if (tab) {
      this.props.changeTab(tab)
    }
  }

  render() {
    const { t } = this.props
    return (
      <div className='send-forms-container'>
        <Row>
          <Col xs={10} offset={7}>
            <Collapse accordion activeKey={this.props.activeTab} onChange={this.changeTab.bind(this)}>
              <Panel
                header={
                  <h3 className='send-asset-form-title'>
                    {t('send.send_asset.title')}
                    <Icon type={this.props.activeTab === 'asset' ? 'down' : 'right'} className='send-form-title-row' />
                  </h3>
                }
                className='send-collapse-panel'
                key='asset'
              >
                <SendAssetForm
                  isLoading={this.props.assetsForm.isLoading}
                  title={t('send.send_asset.title')}
                  columnSize={12}
                  aliases={this.props.aliases}
                  sendAsset={this.sendAsset.bind(this)}
                  onSelectAlias={this.props.getAssetsFromAlias}
                  assetsFromAlias={this.props.assetsForm.states.assetsFromAlias}
                  form={this.props.assetsForm}
                  onChangeForm={this.props.onChangeForm}
                  t={t}
                />
              </Panel>
              <Panel
                header={
                  <h3 className='send-asset-form-title'>
                    {t('send.send_sys.title')}
                    <Icon type={this.props.activeTab === 'sys' ? 'down' : 'right'} className='send-form-title-row' />
                  </h3>
                }
                className='send-collapse-panel'
                key='sys'
              >
                <SendSysForm
                  isLoading={this.props.sysForm.isLoading}
                  title={t('send.send_sys.title')}
                  columnSize={12}
                  balance={this.props.balance}
                  sendSys={this.sendSys.bind(this)}
                  form={this.props.sysForm}
                  onChangeForm={this.props.onChangeForm}
                  t={t}
                />
              </Panel>
            </Collapse>
          </Col>

        </Row>
      </div>
    )
  }
}
