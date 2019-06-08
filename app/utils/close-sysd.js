const Syscoin = require('fusion-syscoin-js').SyscoinRpcClient

const syscoin = new Syscoin({port: 8370, username: 'u', password: 'p', allowCoerce: false})

module.exports = () => syscoin.callRpc('stop', [])
