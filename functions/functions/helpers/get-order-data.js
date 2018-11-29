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
          const unixTime = 24 * 60 * 60 * 1000
          if (data.expiresOn < Date.now() + unixTime) {
            daysLeft = 1
          } else if ((data.expiresOn > Date.now() + (unixTime * 1)) && (data.expiresOn < Date.now() + (unixTime * 3))) {
            daysLeft = 3
          } else if ((data.expiresOn > Date.now() + (unixTime * 3)) && (data.expiresOn < Date.now() + (unixTime * 5))) {
            daysLeft = 5
          } else if ((data.expiresOn > Date.now() + (unixTime * 5)) && (data.expiresOn < Date.now() + (unixTime * 7))) {
            daysLeft = 7
          } else {
            daysLeft = 0
          }
  
          if(daysLeft) {
            getMNData(data.mnDataId, (err, listData) => 
            {
              if(err) {
                console.log(err)
              } else {
                list.push(listData)
              }

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