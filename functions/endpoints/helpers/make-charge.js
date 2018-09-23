const functions = require('firebase-functions')
const stripe = require('stripe')(functions.config().keys.stripe_private)

module.exports = (obj, cb) => {
    let chargeAmount = parseInt(obj.months)

    switch(chargeAmount) {
        case 1:
            chargeAmount = 1500
            break
        case 3:
            chargeAmount = 4500
            break
        case 6:
            chargeAmount = 9000
            break
        case 9:
            chargeAmount = 13500
            break
        case 12:
            chargeAmount = 18000
            break
        default:
            return cb('Invalid amount')
    }

    stripe.charges.create({
        amount: chargeAmount,
        currency: 'usd',
        description: 'Mastermine charge to ' + obj.email,
        source: obj.tokenId
    }, (err, data) => {
        if (err) {
            return cb(err)
        }

        return cb(null, data)
    });
}