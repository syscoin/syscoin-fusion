const { exec } = require('child_process')
const generateCmd = require('./cmd-gen')

module.exports = (cb) => exec(generateCmd('cli', 'stop'), (err, stdout) => cb(err, stdout))
