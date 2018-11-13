const Syscoin = require('fw/syscoin-js')
const syscoin = new Syscoin()

module.exports = () => syscoin.callRpc('stop')
