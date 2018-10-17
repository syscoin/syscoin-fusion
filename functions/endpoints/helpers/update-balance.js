const firebase = require('firebase-functions')
const admin = require('firebase-admin')
const getBalance = require('./get-balance')

module.exports = async (uid, chargeAmount, cb) => {
    
    var currentBalance = await getBalance(uid);

    try {
        currentBalance = parseInt(currentBalance) + chargeAmount;
        if (currentBalance < 0) {
            console.log("Insufficient funds", currentBalance)
            return cb(Error("Transaction failed: Insufficient balance"))
        }

        let obj = {}
        obj[uid] =currentBalance.toString()

        admin.database().ref('/balance').set(obj, (error) => {
            if (error) {
                console.log("Error in update balance1", error)
                return cb("Error updating balance: "+ error)
            }
        })

        return cb(null)
    } catch (err) {
        console.log("Error updating balance: ", err)
        return cb("Error updating balance: "+ err)
    } 
}
