const path = require('path')
const { configureStore } = require('../store/configureStore')

module.exports = (env) => {
    const envLoc = env || configureStore().getState().options.syscoinDataDir
    switch (envLoc) {
        case 'local':
            return path.join(process.cwd(), 'sys_dependencies', 'syscore')
        case 'default':
            return 'C:\\Users\\argvi\\AppData\\Roaming\\SyscoinCore'
        default:
            return ''
    }
}
