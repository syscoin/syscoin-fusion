const admin = require('firebase-admin')

module.exports = (vpsId, obj, cb) => {
    if (!vpsId) {
        return cb(true)
    }

    admin.database().ref('/vps/' + vpsId).update(obj)
        .then(() => cb())
        .catch(error => cb(error))
}
