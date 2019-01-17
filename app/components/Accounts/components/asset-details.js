// @flow
import React, { Component } from 'react'
import { Row, Col, Icon, Spin, Tooltip } from 'antd'
import AvailableAssets from './available-assets'
import TransactionList from './transaction-list'
import AliasInfo from './alias-info'

type Props = {
  t: Function,
  aliasInfo?: Object,
  aliasAssets: Object,
  selectAsset: Functiton,
  goToSendAssetForm: Function,
  selectedAlias: string,
  claimInterest: Function,
  transactions: Object
};

export default (props: Props) => (
  <Row>
    {(props.selectedAlias && !props.aliasAssets.isLoading) && (
      <div>
        <Col offset={1} xs={21}>
          <AliasInfo
            t={props.t}
            isAlias={!!props.aliasInfo.alias.length}
            alias={props.aliasInfo.alias}
            address={props.aliasInfo.address}
            balance={props.aliasInfo.balance}
            avatarUrl={props.aliasInfo.avatarUrl}
          />
        </Col>
        <AvailableAssets
          t={props.t}
          assets={props.aliasAssets.data}
          selectedAsset={props.aliasAssets.selected}
          selectAsset={props.selectAsset}
          goToSendAssetForm={props.goToSendAssetForm}
          claimInterest={props.claimInterest}
        />
      </div>
    )}
    {props.aliasAssets.selected ? (
      <Row>
        <Col offset={1} xs={21}>
          <TransactionList
            data={props.transactions.data}
            error={props.transactions.error}
            isLoading={props.transactions.isLoading}
            selectedAlias={props.selectedAlias}
            selectedSymbol={props.aliasAssets.selectedSymbol}
            t={props.t}
          />
        </Col>
      </Row>
    ) : null}
  </Row>
)
