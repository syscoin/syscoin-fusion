const admin = require('firebase-admin')
const moment = require('moment')
const { each } = require('async')

const getMNData = require('../helpers/get-mn-data')

module.exports = (uid, cb) => {
  admin.database().ref('/orders')
    .orderByChild('userId')
    .equalTo(uid)
    .once('value', snapshot => {

      if (!snapshot.hasChildren()) {
        return cb([])
      }

      const data = snapshot.val()
      const keys = Object.keys(data)
      const toReturn = []

      each(keys, (i, done) => {
        const expireDate = moment(data[i].expiresOn)
        const now = moment()

        now.add(3, 'days')

        if (now > expireDate) {
          return getMNData(data[i].mnDataId, (err, listData) => {
            if (err) {
              return done()
            }
            toReturn.push(listData)
            done()
          })
        }

        done()
      }, () => {
        return cb(toReturn)
      })
    })
}