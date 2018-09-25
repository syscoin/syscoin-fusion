const find = require('find-process')

module.exports = cb => find('name', 'syscoin-cli').then(list => cb(null, !!list.length)).catch(err => cb(err))
