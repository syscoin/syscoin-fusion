const Syscoin = require('syscoin-js').SyscoinRpcClient
const syscoin = new Syscoin()

module.exports = () => syscoin.callRpc('stop')
