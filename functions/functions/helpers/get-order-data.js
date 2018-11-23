const admin = require('firebase-admin')

const getMNData = require('../helpers/get-mn-data')

module.exports = (uid) => {
    let list = {}
  
    admin.database().ref('/orders')
    .orderByChild('userId')
    .equalTo(uid)
    .once('value', snapshot => {
  
      if (snapshot.hasChildren()) {
        let index = 0
        while(true) {
          const key = Object.keys(snapshot.val())[index]
          const data = snapshot.val()[key]
  
          // console.log(data)
          if (!data)
            break
  
          let daysLeft
  
          if (data.expiresOn < Date.now() + (24 * 60 * 60)) {
            daysLeft = 1
          } else if ((data.expiresOn > Date.now() + (24 * 60 * 60* 1)) && (data.expiresOn < Date.now() + (24 * 60 * 60* 3))) {
            daysLeft = 3
          } else if ((data.expiresOn > Date.now() + (24 * 60 * 60* 3)) && (data.expiresOn < Date.now() + (24 * 60 * 60* 5))) {
            daysLeft = 5
          } else if ((data.expiresOn > Date.now() + (24 * 60 * 60* 5)) && (data.expiresOn < Date.now() + (24 * 60 * 60* 7))) {
            daysLeft = 7
          } else {
            daysLeft = 0
          }
  
          console.log(daysLeft)
          if(daysLeft) {
            console.log("Getting data for: ", data.mnDataId)
            let listData = getMNData(data.mnDataId)
            // console.log(listData)
            list.push(listData)
          } else {
            continue
          }
  
          index++
        }
        
      }
    })
  
    console.log("List data: ", list)
    return list
}