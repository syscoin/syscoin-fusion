const functions = require('firebase-functions')
const stripe = require('stripe')(functions.config().keys.stripe_private)

module.exports = (obj, cb) => {
    let chargeAmount = parseInt(obj.chargeAmount)

    stripe.charges.create({
        amount: chargeAmount,
        currency: 'usd',
        description: 'Masterminer charge to ' + obj.email,
        source: obj.tokenId
    }, (err, data) => {
        if (err) {
            return cb(err)
        }

        return cb(null, data)
    });
}