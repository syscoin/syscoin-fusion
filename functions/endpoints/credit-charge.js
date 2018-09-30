const firebase = require('firebase-functions')
const admin = require('firebase-admin')
const async = require('async')

const makeCharge = require('./helpers/make-charge')
const updateBalance = require('./helpers/update-balance')

module.exports = (req, res, next) => {
    try {
        let token = req.body.token,
            chargeAmount = req.body.amount

            return makeCharge({
                email,
                chargeAmount,
                tokenId: token
            }, (err, charge) => {
                if (err) {
                    return res.status(400).send({
                        error: true,
                        message: 'Something went wrong during the payment. Try again later.'
                    })
                }
    
                updateBalance(amount, (err) => {
                    if (err) {
                        return res.status(400).send({
                            error: true,
                            message: 'Error updating balance. Contact support'
                        })
                    }
                });

                return res.send({
                    message: 'Payment completed',
                    expiresOn: new Date().setMonth(new Date().getMonth() + parseInt(months)),
                    purchaseDate: Date.now(),
                    paymentId: charge.id
                })
            })
    } catch (err) {
        return next(err)
    }

}
