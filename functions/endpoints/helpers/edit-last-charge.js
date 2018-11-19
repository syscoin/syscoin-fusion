const admin = require('firebase-admin')

module.exports = (orderId, cb) => {
    admin.database().ref('/mn-data')
        .orderByChild('orderId')
        .equalTo(orderId)
        .once('value', snapshot => {
            const data = snapshot.val()
            const key = Object.keys(data)[0]
            if (!snapshot.hasChildren()) {
                return cb(new Error('That order dont exist'))
            }
            admin.database().ref('/mn-data/' + key +'/chargeLastMadeAt')
                .set(Date.now())
                .then(() => cb())
                .catch(() => cb('Internal server error'))
    }).catch(() => cb('Internal server error'))
}
