// @flow
import React, { Component } from 'react'
import { Row, Col, Tabs } from 'antd'

import AccountsContainer from 'fw-containers/Accounts'
import SendContainer from 'fw-containers/Send'
import ToolsContainer from 'fw-containers/Tools'
// import Personalize from './Personalize'

import WindowControls from './components/window-control'

const Tab = Tabs.TabPane

type Props = {
  onMinimize: Function,
  onClose: Function
};

class Wallet extends Component<Props> {
  props: Props

  generateWindowControls() {
    return <WindowControls onMinimize={this.props.onMinimize} onClose={this.props.onClose} />
  }

  render() {
    return (
      <Row className='app-body'>
        <Col xs={24}>
          <Tabs className='tabs-app' tabBarExtraContent={this.generateWindowControls()}>
            <Tab className='tab tab-accounts' tab='Accounts' key='1'>
              <AccountsContainer />
            </Tab>
            <Tab className='tab tab-send' tab='Send' key='2'>
              <SendContainer />
            </Tab>
            <Tab className='tab tab-tools' tab='Tools' key='3'>
              <ToolsContainer />
            </Tab>
            {/*<Tab className='tab tab-personalize' tab='Personalize' key='4'>
              <Personalize
                aliasInfo={this.props.aliasInfo}
                currentAliases={this.state.aliases || []}
                editAlias={this.props.editAlias}
              />
            </Tab>*/}
          </Tabs>
        </Col>
      </Row>
    )
  }
}

export default Wallet
