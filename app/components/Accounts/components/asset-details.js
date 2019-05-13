// @flow
import React from 'react'
import { Row, Col } from 'antd'
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
      <Row>
        <Col offset={1} xs={21}>
          <AliasInfo
            t={props.t}
            isAlias={!!props.aliasInfo.alias}
            alias={props.aliasInfo.alias || ''}
            address={props.aliasInfo.address}
            balance={props.aliasInfo.balance}
            avatarUrl={props.aliasInfo.avatarUrl}
          />
        </Col>
        <Col offset={1} xs={21}>
          <AvailableAssets
            t={props.t}
            assets={props.aliasAssets.data}
            selectedAsset={props.aliasAssets.selected}
            selectAsset={props.selectAsset}
            goToSendAssetForm={props.goToSendAssetForm}
            claimInterest={props.claimInterest}
            selectedAlias={props.selectedAlias}
          />
        </Col>
      </Row>
    )}
    {props.aliasAssets.selected ? (
      <Row>
        <Col offset={1} xs={21}>
          <TransactionList
            data={props.transactions.data}
            error={props.transactions.error}
            isLoading={props.transactions.isLoading}
            selectedAlias={props.selectedAlias}
            selectedAsset={props.aliasAssets.selected}
            selectedSymbol={props.aliasAssets.selectedSymbol}
            changePage={(page) => props.selectAsset({
              asset: props.aliasAssets.selected,
              symbol: props.aliasAssets.selectedSymbol,
              page
            })}
            t={props.t}
          />
        </Col>
      </Row>
    ) : null}
  </Row>
)
