const { app } = require('electron').remote
const path = require('path')
const OS = require('./detect-os')()
const { configureStore } = require('../store/configureStore')

module.exports = (env) => {
    const envLoc = env || configureStore().getState().options.syscoinDataDir
    switch (envLoc) {
        case 'local':
            return path.join(process.cwd(), 'sys_dependencies', 'syscore')
        case 'default':
            if (OS === 'win') {
                return path.join(app.getPath('appData'), 'SyscoinCore')
            } else if (OS === 'osx') {
                return path.join(app.getPath('appData'), 'SyscoinCore')
            } else if (OS === 'linux') {
                return path.join('~', '.syscoincore')
            }
            return path.join(process.env.APPDATA, 'SyscoinCore')
        default:
            return ''
    }
}
