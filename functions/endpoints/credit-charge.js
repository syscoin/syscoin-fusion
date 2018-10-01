const firebase = require('firebase-functions')
const admin = require('firebase-admin')
const async = require('async')

const makeCharge = require('./helpers/make-charge')
const updateBalance = require('./helpers/update-balance')

module.exports = (req, res, next) => {
    try {
        let tokenId = req.body.tokenId,
            chargeAmount = req.body.amount*1000,
            email = req.body.email

            
            return makeCharge({
                email,
                chargeAmount,
                tokenId
            }, (err, charge) => {
                if (err) {
                    console.log(err)
                    return res.status(400).send({
                        error: true,
                        message: 'Credit Something went wrong during the payment. Try again later.'
                    })
                }
                updateBalance(req.user.uid, chargeAmount, (err) => {
                    if (err) {
                        return res.status(400).send({
                            error: true,
                            message: 'Error updating balance. Contact support'
                        })
                    }
                });

                return res.status(200).send({
                    message: 'Payment completed',
                    expiresOn: new Date().setMonth(new Date().getMonth()),
                    purchaseDate: Date.now(),
                    paymentId: charge.id
                })
            })
    } catch (err) {
        return next(err)
    }

}
