const admin = require('firebase-admin')
const getBalance = require('./get-balance')

module.exports = (uid, chargeAmount, cb) => {
    
    try {
        var currentBalance = 0;
         getBalance(uid, (val) => {
            currentBalance = parseInt(val) + chargeAmount;
            if (currentBalance < 0) {
                return cb(Error("Transaction failed: Insufficient balance"))
            }

            let obj = {}
            obj[uid] =currentBalance.toString()

            admin.database().ref(`/balance/${uid}`).set(obj, (error) => {
                if (error) {
                    return cb("Error updating balance: "+ error)
                }
            })

        })
       
        return cb(null)
    } catch (err) {
        return cb("Error updating balance: "+ err)
    } 
}
