const admin = require('firebase-admin')

module.exports = (mnId, cb) => {
    admin.database().ref(`/mn-data/${mnId}`)
    .once('value', snapshot => {
  
      if (snapshot.hasChildren()) {
        const data = snapshot.val()
  
        let info = {
          'name': data.mnName,
          'type': data.nodeType
        }
        return cb(info)
      }
    })
}
  