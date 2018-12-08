const functions = require('firebase-functions')
const admin = require('firebase-admin')
const nodemailer = require('../email')
const { each } = require('async')

const getOrderData = require('../helpers/get-order-data')

const expiryEmail = require('../email/templates/expiry_notification')

module.exports = functions.pubsub.topic('wallet-balance-watch').onPublish(event => {
  return new Promise((resolve, reject) => {

    admin.auth().listUsers()
      .then((listUsersResult) => {

        return each(listUsersResult.users, (userRecord, done) => {
          let user = userRecord.toJSON()

          getOrderData(user.uid, (emailList) => {
            if (emailList && emailList.length) {
              sendEmail(user.email, emailList, err => {
                if (err) {
                  console.log(err)
                }

                done()
              })
            } else {
              resolve()
            }
          })

        }, () => resolve())
      })
      .catch((error) => {
        console.log("Error listing users:", error);

        return reject(error)
      })
  })
})

function sendEmail(email, list, cb) {
  return nodemailer.sendMail({
    from: 'notification@masterminer.tech',
    to: email,
    subject: `Your masternodes need your attention!`,
    html: expiryEmail(list)
  }, err => cb(err))
}
