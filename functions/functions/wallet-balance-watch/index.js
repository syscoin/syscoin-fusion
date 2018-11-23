require('dotenv').config({path: process.cwd() + '/scripts/.env'})

const functions = require('firebase-functions')
const admin = require('firebase-admin')

const getOrderData = require('../helpers/get-order-data')

let serviceAccount

try {
    serviceAccount = require('../../../scripts/serviceKey.json')
} catch (err) {
    throw new Error('ERROR: Cant find serviceKey.json (it should be located in the scripts folder)')
} 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.SCRIPT_DB_URL
})

// module.exports = functions.pubsub.topic('wallet-balance-watch').onPublish(event => {

module.exports = (req, res, next) => {
    // return new Promise((resolve, reject) => {
        // Todo: Paginate results to scale


  admin.auth().listUsers()
  .then((listUsersResult) => {
    listUsersResult.users.forEach((userRecord) => {
      let user =  userRecord.toJSON()

      let emailList = getOrderData(user.uid)

      if (emailList) {
        sendEmail(emailList)
      }
    });
    // return done()
      if (listUsersResult.pageToken) {
        // List next batch of users.
        console.log("Page token: ",listUsersResult.pageToken)
      }
      return res.status(200).send()
  })
  .catch((error) => {
    console.log("Error listing users:", error);

    // return resolve()

      return res.status(500).send()
  });

// })
}

function sendEmail(list) {
  // console.log("List: ",list)
}