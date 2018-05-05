const admin = require('firebase-admin')

module.exports = (cb) => {
    admin.database().ref('/vps').once('value', snapshot => {
        const snap = snapshot.val()
        const keys = Object.keys(snap)

        return cb(null, keys.map(i => snap[i].ip))
    }).catch(err => cb(err))
}
