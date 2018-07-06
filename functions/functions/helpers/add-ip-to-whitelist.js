const admin = require('firebase-admin')

module.exports = (ip, cb) => {
    admin.database().ref('/global').once('value', snapshot => {
        let ipWhiteList 

        if (!snapshot.hasChildren()) {
            if (!snapshot.val().ipWhiteList) {
                ipWhiteList = []
            }
        } else {
            ipWhiteList = snapshot.val().ipWhiteList
        }

        ipWhiteList.push(ip)

        snapshot.ref.update({
            ipWhiteList
        }).then(() => cb(null, true)).catch(() => cb(true))

    }).catch(err => cb(err))
}
