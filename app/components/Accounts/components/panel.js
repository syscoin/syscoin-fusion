// @flow
import React from 'react'
import { Col } from 'antd'
import AliasContainer from './alias-container'
import Home from './home'
import UserBalance from './balance'

type Props = {
  t: Function,
  aliases: Array<Object>,
  aliasAssets: Object,
  transactions: Object,
  currentBalance: number,
  goToHome: Function,
  syncPercentage: number,
  headBlock: number,
  getNewAddress: Function,
  currentBlock: number,
  updateSelectedAlias: Function,
  claimInterest: Function,
  selectedAlias: string,
  getPrivateKey: Function
};

export default (props: Props) => (
  <Col xs={9} className='accounts-container-left'>
    <Home
      onClick={props.goToHome}
      className='home-btn'
      disabled={props.transactions.isLoading || props.aliasAssets.isLoading}
    />
    <UserBalance
      currentBalance={props.currentBalance}
      t={props.t}
    />
    <hr className='alias-separator' />
    <AliasContainer
      t={props.t}
      aliases={props.aliases}
      aliasAssets={props.aliasAssets}
      updateSelectedAlias={props.updateSelectedAlias}
      getPrivateKey={props.getPrivateKey}
      getNewAddress={props.getNewAddress}
      claimInterest={props.claimInterest}
      syncPercentage={props.syncPercentage}
      headBlock={props.headBlock}
      currentBlock={props.currentBlock}
      selectedAlias={props.selectedAlias}
    />
  </Col>
)
