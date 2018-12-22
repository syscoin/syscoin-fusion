const AWS = require('aws-sdk')
const config = require('./aws.js')
AWS.config.update(config)

module.exports = AWS
