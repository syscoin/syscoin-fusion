const path = require('path')

/**
 * Determine the array of extensions that should be used to resolve modules.
 */
module.exports = {
  extensions: ['.js', '.jsx', '.json'],
  modules: [path.join(__dirname, 'app'), 'node_modules'],
  alias: {
    'fw-containers': path.resolve(__dirname, 'app/containers/'),
    'fw-components': path.resolve(__dirname, 'app/components/'),
    'fw-utils': path.resolve(__dirname, 'app/utils/'),
    'fw-sys': path.resolve(__dirname, 'app/utils/sys-helpers/'),
    'fw': path.resolve(__dirname, 'app/')
  }
}
