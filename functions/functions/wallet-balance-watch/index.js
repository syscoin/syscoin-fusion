const functions = require('firebase-functions')
const admin = require('firebase-admin')
const nodemailer = require('../email')

const getOrderData = require('../helpers/get-order-data')

const expiryEmail = require('../email/templates/expiry_notification')

module.exports = functions.pubsub.topic('wallet-balance-watch').onPublish(event => {
  return new Promise((resolve, reject) => {
  // Todo: Paginate results to scale
    admin.auth().listUsers()
    .then((listUsersResult) => {
      listUsersResult.users.forEach((userRecord) => {
        let user =  userRecord.toJSON()

        getOrderData(user.uid, (emailList) => {
          if (emailList) {
            sendEmail(user.email, emailList)
          }
        })

      });

      if (listUsersResult.pageToken) {
        // List next batch of users.
        console.log("Page token: ",listUsersResult.pageToken)
      }

      return done()
    })
    .catch((error) => {
      console.log("Error listing users:", error);

      return resolve()
    });
  })
})

function sendEmail(email, list) {
  return nodemailer.sendMail({
    from: 'notification@masterminer.tech',
    to: email,
    subject: `Your masternodes need your attention!`,
    html: expiryEmail(list)
})
}