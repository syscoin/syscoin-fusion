const admin = require('firebase-admin')
const async = require('async')

module.exports = (keys, cb) => {
    async.each(keys, (i, cb) => {
        admin.database().ref('/to-deploy/' + i)
                        .update({
                            lock: true,
                            lockDate: Date.now()
                        })
                        .then(() => cb(null))
                        .catch(() => cb(true))
    }, (err) => {
        if (err) {
            return cb(true)
        }

        return cb(null)
    })
}
