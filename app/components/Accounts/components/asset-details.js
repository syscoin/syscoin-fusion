// @flow
import React, { Component } from 'react'
import { Row, Col, Icon, Spin, Tooltip } from 'antd'
import AvailableAssets from './available-assets'
import TransactionList from './transaction-list'

type Props = {
  t: Function,
  aliasAssets: Object,
  selectAsset: Functiton,
  goToSendAssetForm: Function,
  selectedAlias: string,
  claimInterest: Function,
  transactions: Object
};

export default (props: Props) => (
  <Row>
    {props.aliasAssets.data.length ? (
      <AvailableAssets
        assets={props.aliasAssets.data}
        selectedAsset={props.aliasAssets.selected}
        selectAsset={props.selectAsset}
        goToSendAssetForm={props.goToSendAssetForm}
        claimInterest={props.claimInterest}
        t={props.t}
      />
    ) : null}
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
