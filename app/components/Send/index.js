// @flow
import React, { Component } from 'react'
// import { Link } from 'react-router-dom'
import { Row } from 'antd'

import SendAssetForm from './components/send-asset'
import SendSysForm from './components/send-sys'


type Props = {
  assetIsLoading: boolean,
  sysIsLoading: boolean,
  aliases: Array<string>,
  sendAsset: Function,
  sendSys: Function,
  balance: number,
  assets: Array<string>
};

type sendAssetType = {
  from: string,
  asset: string,
  toAddress: string,
  amount: string
};

type sendSysType = {
  amount: string,
  address: string,
  comment: string
};

export default class Send extends Component<Props, State> {

  sendSys(obj: sendSysType, cb: Function) {
    this.props.sendSys(obj, err => cb(err))
  }

  sendAsset(obj: sendAssetType, cb: Function) {
    this.props.sendAsset(obj, err => cb(err))
  }

  render() {
    return (
      <Row gutter={24}>
        <SendAssetForm
          isLoading={this.props.assetIsLoading}
          title='Send Asset'
          columnSize={12}
          assets={this.props.assets}
          aliases={this.props.aliases}
          sendAsset={this.sendAsset.bind(this)}
        />
        <SendSysForm
          isLoading={this.props.sysIsLoading}
          title='Send SYS'
          columnSize={12}
          balance={this.props.balance}
          sendSys={this.sendSys.bind(this)}
        />
      </Row>
    )
  }
}
