const admin = require('firebase-admin')

module.exports = (orderId, cb) => {
    admin.database().ref('/orders/' + orderId + '/chargeLastMadeAt')
        .set(Date.now())
        .then(() => cb())
        .catch(() => cb('Internal server error'))
}
