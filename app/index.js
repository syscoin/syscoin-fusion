/* eslint import/first:0 */
require('dotenv').config()

import React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { remote } from 'electron'
import Root from './containers/Root'
import { configureStore, history } from './store/configureStore'
import Storage from './utils/storage'
import storageSchema from './utils/helpers/storage-schema'
import getEnv from 'fw-utils/get-env'
import closeSysd from './utils/close-sysd'
import './app.global.scss'

const store = configureStore()
const isProd = getEnv() === 'production'

// App storage setup
global.appStorage = new Storage({
  configName: 'app-storage',
  defaults: { ...storageSchema }
})

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
window.onbeforeunload = async () => {

  global.appStorage.eraseAll()

  if (isProd) {
    try {
      await closeSysd()
    } catch (err) {
      window.onbeforeunload = null
      remote.app.quit()
    }
  } else {
    window.onbeforeunload = null
    remote.app.quit()
  }
}
