const Syscoin = require('syscoin-js').SyscoinRpcClient
const syscoin = new Syscoin({port: 8369, username: 'u', password: 'p'})

module.exports = () => syscoin.callRpc('stop')
