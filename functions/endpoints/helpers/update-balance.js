const admin = require('firebase-admin')
const getBalance = require('./get-balance')

module.exports = (uid, chargeAmount, cb) => {

    try {
        var currentBalance = 0;
        getBalance(uid, (err, val) => {
            if (err) {
                return admin.database().ref(`/balance/${uid}`).set(0)
                    .then(() => cb(Error("Transaction failed: Insufficient balance")))
            }
            currentBalance = parseInt(val) + chargeAmount;
            if (currentBalance < 0) {
                return cb(Error("Transaction failed: Insufficient balance"))
            }

            const newBalance = currentBalance


            admin.database().ref(`/balance/${uid}`).set(newBalance, (error) => {
                if (error) {
                    return cb("Error updating balance: " + error)
                }
            })

        })

        return cb(null)
    } catch (err) {
        return cb("Error updating balance: " + err)
    }
}
