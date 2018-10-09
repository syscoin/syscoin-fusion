// @flow
import React, { Component } from 'react'
import { Row, Col, Tabs } from 'antd'

import AccountsContainer from 'fw-containers/Accounts'
import SendContainer from 'fw-containers/Send'
import ToolsContainer from 'fw-containers/Tools'
import Personalize from 'fw-containers/Personalize'

import WindowControls from './components/window-control'

const Tab = Tabs.TabPane

type Props = {
  isMaximized: boolean,
  onMinimize: Function,
  onClose: Function,
  onMaximize: Function,
  onUnmaximize: Function
};

class Wallet extends Component<Props> {
  props: Props

  render() {
    return (
      <Row className='app-body'>
        <WindowControls
          isMaximized={this.props.isMaximized}
          onMinimize={this.props.onMinimize}
          onClose={this.props.onClose}
          onMaximize={this.props.onMaximize}
          onUnmaximize={this.props.onUnmaximize}
        />
        <Col xs={24}>
          <Tabs className='tabs-app'>
            <Tab className='tab tab-accounts' tab='Accounts' key='1'>
              <AccountsContainer />
            </Tab>
            <Tab className='tab tab-send' tab='Send' key='2'>
              <SendContainer />
            </Tab>
            <Tab className='tab tab-tools' tab='Tools' key='3'>
              <ToolsContainer />
            </Tab>
            <Tab className='tab tab-personalize' tab='Personalize' key='4'>
              <Personalize />
            </Tab>
          </Tabs>
        </Col>
      </Row>
    )
  }
}

export default Wallet
