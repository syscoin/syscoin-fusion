// @flow
const { join } = require('path')
const { app } = require('electron').remote

const appDocsPath = join(app.getPath('documents'), 'Fusion')
const customCssPath = join(appDocsPath, 'custom.css')
const confPath = join(appDocsPath, 'fusion.cfg')

export default () => ({
    appDocsPath,
    customCssPath,
    confPath
})
