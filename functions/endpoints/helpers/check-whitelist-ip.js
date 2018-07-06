const admin = require('firebase-admin')

module.exports = (ip, cb) => {
    admin.database().ref('/global/ipWhiteList').once('value', snapshot => {
        const ips = snapshot.val()

        if (ips) {
            return cb(null, ips.indexOf(ip) !== -1)
        } else {
            return cb(true)
        }

    }).catch(err => cb(err))
}
