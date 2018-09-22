const admin = require('firebase-admin')

module.exports = (vpsId, cb) => {
    
    return admin.database().ref('/keys')
        .orderByChild('vpsId')
        .equalTo(vpsId)
        .once('value', snapshot => {
            try {
                const data = snapshot.val()
                const key = Object.keys(data)[0]

                return cb(null, key)
            } catch (e) {
                console.log(e)
                return cb(true)
            }
        }).catch(err => {
            return cb(err)
        })
}
