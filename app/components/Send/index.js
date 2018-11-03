// @flow
import React, { Component } from 'react'
// import { Link } from 'react-router-dom'
import { Row, Col } from 'antd'

import SendAssetForm from './components/send-asset'
import SendSysForm from './components/send-sys'


type Props = {
  aliases: Array<string>,
  sendAsset: Function,
  sendSys: Function,
  balance: number,
  assets: Array<Object>,
  getAssetsFromAlias: Function,
  assetsFromAliasIsLoading: boolean,
  assetsForm: {
    data: sendAssetType,
    isLoading: boolean,
    error: boolean
  },
  sysForm: {
    data: sendSysType,
    isLoading: boolean,
    error: boolean
  }
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

  sendSys(obj: sendSysType, cb: Function) {
    this.props.sendSys(obj, err => cb(err))
  }

  sendAsset(obj: sendAssetType, cb: Function) {
    this.props.sendAsset(obj, err => cb(err))
  }

  render() {
    return (
      <div className='send-forms-container'>
        <Row gutter={24}>
          <SendAssetForm
            isLoading={this.props.assetsForm.isLoading}
            title='Send Asset'
            columnSize={12}
            assets={this.props.assets}
            aliases={this.props.aliases}
            sendAsset={this.sendAsset.bind(this)}
            onSelectAlias={this.props.getAssetsFromAlias}
            assetsFromAliasIsLoading={this.props.assetsFromAliasIsLoading}
            form={this.props.assetsForm.data}
          />
        </Row>
        <Row>
          <Col xs={10} offset={7}>
            <hr />
          </Col>
        </Row>
        <Row gutter={24}>
          <SendSysForm
            isLoading={this.props.sysForm.isLoading}
            title='Send SYS'
            columnSize={12}
            balance={this.props.balance}
            sendSys={this.sendSys.bind(this)}
            form={this.props.sysForm.data}
          />
        </Row>
      </div>
    )
  }
}
