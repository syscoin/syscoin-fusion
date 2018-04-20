const admin = require('firebase-admin')

module.exports = (obj, cb) => {
    const { vpsId, status } = obj

    admin.database().ref('/vps/' + vpsId).update({
        status,
        lastUpdate: Date.now()
    }).then(() => {
        return cb(null)
    }).catch(error => cb(error))
}
