/* eslint import/first:0 */
require('dotenv').config()

import React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { remote } from 'electron'
import Root from './containers/Root'
import { configureStore, history } from './store/configureStore'
import detectSysdRunning from './utils/detect-sysd-running'
import Storage from './utils/storage'
import storageSchema from './utils/helpers/storage-schema'
import closeSysd from './utils/close-sysd'
import isProd from './utils/is-production'
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

// App storage setup
global.appStorage = new Storage({
  configName: 'app-storage',
  defaults: {...storageSchema}
})

// Closes syscoind on exit
window.onbeforeunload = () => {
  // Clean intervals
  clearInterval(global.checkInterval)
  clearInterval(global.updateWalletInterval)
  if (detectSysdRunning() && isProd) {
    closeSysd(() => {
      remote.app.quit()
    })
  }
}
