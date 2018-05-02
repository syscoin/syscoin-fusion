const functions = require('firebase-functions')
const nodemailer = require('nodemailer')
const mg = require('nodemailer-mailgun-transport')

const auth = {
  auth: {
    api_key: functions.config().keys.mailgun_key,
    domain: 'masterminer.tech'
  }
}

const nodemailerMailgun = nodemailer.createTransport(mg(auth))

module.exports = nodemailerMailgun
