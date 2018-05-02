const admin = require('firebase-admin')

module.exports = (obj, cb) => {
    const { vpsId, status, configFile } = obj

    admin.database().ref('/vps/' + vpsId).update({
        configFile,
        status,
        lastUpdate: Date.now()
    }).then(() => {
        return cb(null)
    }).catch(error => cb(error))
}
