const functions = require('firebase-functions')
const admin = require('firebase-admin')

module.exports = (obj, cb) => {
    const orderId = obj.orderId,
        expiryDate = new Date(parseInt(obj.expiry)),
        months = parseInt(obj.months),
        numberOfMonths = parseInt(obj.numberOfMonths)

    admin.database().ref('/orders/' + orderId).update({
        expiresOn: expiryDate.setMonth(expiryDate.getMonth() + months),
        numberOfMonths: numberOfMonths + months
    }).then(() => {
        return cb(null)
    }).catch(err => {
        return cb(err)
    })        
}