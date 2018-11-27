const admin = require('firebase-admin')

const getMNData = require('../helpers/get-mn-data')

module.exports = (uid, cb) => {
  let list = []
  let index = 0, length

  admin.database().ref('/orders')
    .orderByChild('userId')
    .equalTo(uid)
    .once('value', snapshot => {

      length = snapshot.numChildren()
      if (snapshot.hasChildren()) {
        while (true) {
          const key = Object.keys(snapshot.val())[index]
          const data = snapshot.val()[key]

          if (!data) {
            break
          }

          let daysLeft

          if (data.expiresOn < Date.now() + (24 * 60 * 60 * 1000)) {
            daysLeft = 1
          } else if ((data.expiresOn > Date.now() + (24 * 60 * 60 * 1000)) && (data.expiresOn < Date.now() + (24 * 60 * 60 * 1000 * 3))) {
            daysLeft = 3
          } else if ((data.expiresOn > Date.now() + (24 * 60 * 60 * 1000 * 3)) && (data.expiresOn < Date.now() + (24 * 60 * 60 * 1000 * 5))) {
            daysLeft = 5
          } else if ((data.expiresOn > Date.now() + (24 * 60 * 60 * 1000 * 5)) && (data.expiresOn < Date.now() + (24 * 60 * 60 * 1000 * 7))) {
            daysLeft = 7
          } else {
            daysLeft = 0
          }

          if (daysLeft) {
            getMNData(data.mnDataId, (listData) => {
              list.push(listData)
              if (list.length === length)
                return cb(list)
            })
          } else {
            continue
          }

          index++
        }

      }
    })
}