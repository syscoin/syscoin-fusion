const functions = require('firebase-functions')
const nodemailer = require('nodemailer')
const mg = require('nodemailer-mailgun-transport')

const auth = {
  auth: {
    api_key: functions.config().keys.mailgun_key,
    domain: 'sandbox6351a8c4802147d8bdaa328a7e0386f4.mailgun.org'
  }
}

const nodemailerMailgun = nodemailer.createTransport(mg(auth))

module.exports = nodemailerMailgun
