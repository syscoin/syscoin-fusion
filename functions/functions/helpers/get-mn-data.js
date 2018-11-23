const admin = require('firebase-admin')

module.exports = (mnId) => {
    admin.database().ref(`/mn-data/${mnId}`)
    .once('value', snapshot => {
  
      if (snapshot.hasChildren()) {
        const key = Object.keys(snapshot.val())[0]
        const data = snapshot.val()[key]
  
        let info = {
          'name': data.mnName,
          'type': data.nodeType
        }
        console.log("Got data:", info)
        return info
      }
    })
}
  