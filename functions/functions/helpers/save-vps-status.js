const admin = require('firebase-admin')

module.exports = (obj, cb) => {
    const { vpsId, status, configFile, imageId } = obj

    if (!vpsId) {
        return cb(true)
    }

    const toUpdate = {
        configFile,
        status
    }

    if (imageId) {
        toUpdate.imageId = imageId
    }

    admin.database().ref('/vps/' + vpsId).update(toUpdate).then(() => {
        return cb(null)
    }).catch(error => cb(error))
}
