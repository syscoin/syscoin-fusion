const functions = require('firebase-functions')

module.exports = (obj, cb) => {

    const orderId = obj.orderId,
        expiryDate = new Date(obj.expiry),
        months = obj.months,
        numberOfMonths = obj.numberOfMonths

    admin.database().ref('/orders/' + orderId).update({
        expiresOn: expiryDate.setMonth(expiryDate.getMonth() + parseInt(months)),
        numberOfMonths: parseInt(numberOfMonths) + parseInt(months)
    }).then(() => {
        return cb(null)
    }).catch(err => {
        return cb(err)
    })        
}