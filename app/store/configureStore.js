// @flow
if (process.env.NODE_ENV !== 'development') {
  const configureStore = require('./configureStore.prod') // eslint-disable-line global-require
  module.exports = {
    store: configureStore.configureStore(),
    history: configureStore.history
  }
} else {
  const configureStore = require('./configureStore.dev') // eslint-disable-line global-require
  module.exports = {
    store: configureStore.configureStore(),
    history: configureStore.history
  }
}
