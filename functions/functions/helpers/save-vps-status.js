const admin = require('firebase-admin')

module.exports = (obj, cb) => {
    const { vpsId, status, configFile } = obj

    if (!vpsId) {
        return cb(true)
    }

    admin.database().ref('/vps/' + vpsId).update({
        configFile,
        status
    }).then(() => {
        return cb(null)
    }).catch(error => cb(error))
}
