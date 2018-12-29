const admin = require('firebase-admin')
const getBalance = require('./get-balance')

module.exports = (uid, chargeAmount, cb) => {
    let currentBalance = 0
    getBalance(uid, (err, val) => {
        if (err) {
            return cb('Error get balance')
        }

        currentBalance = parseFloat(val) + chargeAmount

        if (currentBalance < 0) {
            return cb('Transaction failed: Insufficient balance')
        }

        const newBalance = currentBalance

        admin.database().ref(`/balance/${uid}`).set(newBalance, (error) => {
            if (error) {
                return cb('Error updating balance: ' + error)
            }

            return cb()
        })

    })
}
