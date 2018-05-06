const functions = require('firebase-functions')
const stripe = require('stripe')(functions.config().keys.stripe_private)

module.exports = (obj, cb) => {
    stripe.charges.create({
        amount: 50/*(parseInt(obj.months) * 15) * 100*/,
        currency: 'usd',
        description: 'Mastermine charge to ' + obj.email,
        source: obj.tokenId
    }, (err, charge) => {
        if (err) {
            return cb(err)
        }

        return cb(null, charge)
    });
}