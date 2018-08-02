/* eslint import/first:0 */
require('dotenv').config()

import React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { remote } from 'electron'
import Root from './containers/Root'
import { configureStore, history } from './store/configureStore'
import detectSysdRunning from './utils/detect-sysd-running'
import closeSysd from './utils/close-sysd'
import './app.global.css'

const store = configureStore()

render(
  <AppContainer>
    <Root store={store} history={history} />
  </AppContainer>,
  document.getElementById('root')
)

if (module.hot) {
  module.hot.accept('./containers/Root', () => {
    const NextRoot = require('./containers/Root') // eslint-disable-line global-require
    render(
      <AppContainer>
        <NextRoot store={store} history={history} />
      </AppContainer>,
      document.getElementById('root')
    )
  })
}

// Closes syscoind on exit
window.onbeforeunload = (e) => {
  e.preventDefault()
  if (detectSysdRunning()) {
    closeSysd(() => {
      remote.app.quit()
    })
  }
}
