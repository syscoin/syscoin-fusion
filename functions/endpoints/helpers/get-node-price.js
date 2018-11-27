const admin = require('firebase-admin')

module.exports = (nodeType) => new Promise((resolve, reject) => {
    admin.database().ref('/prices/' + nodeType.toUpperCase()).once('value')
        .then(snap => resolve(snap.val()))
        .catch(err => reject(err))
})
