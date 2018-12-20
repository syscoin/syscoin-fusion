// @flow
import React, { Component } from 'react'
import { Button, Icon, Spin } from 'antd'
import swal from 'sweetalert'
import { join } from 'path'

type Props = {
  toggleConsole: Function
};

export default (props: Props) => (
  <div className='toggle-console-container'>
    <h3 className='toggle-console-title'>Console</h3>
    <Button className='toggle-console-btn' onClick={props.toggleConsole}>
      <Icon type='download' /> Open console
    </Button>
  </div>
)
