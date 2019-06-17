// @flow
const socket = require('zeromq').socket('sub')

module.exports = (listenTo: string, cb: Function) => {
  socket.connect(listenTo)
  socket.subscribe('pubwalletrawtx')
  socket.subscribe('walletrawtx')

  socket.on('message', cb)
}
