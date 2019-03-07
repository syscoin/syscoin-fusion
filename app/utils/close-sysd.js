const Syscoin = require('fw/syscoin-js').default
const syscoin = new Syscoin()

module.exports = () => syscoin.callRpc('stop')
