const firebase = require('firebase-functions')
const admin = require('firebase-admin')

const makeCharge = require('./helpers/make-charge')
const coinbaseCharge = require('./helpers/coinbase-charge')
const updateExpiry = require('./helpers/update-expiry')

module.exports = (req, res, next) => {
    const { orderId, tokenId, months, email, coinbase, type } = req.body
    const obj = {
        email,
        months,
        tokenId
    }

    return admin.database().ref('/orders/' + orderId)
        .once('value', snapshot => {
            const snaps = snapshot.val()

            const payload = {
                orderId : orderId,
                expiry : snaps.expiresOn,
                months : months,
                numberOfMonths : snaps.numberOfMonths,
                renew: coinbase,
                type: type
            }

            if (snaps.userId === req.user.uid) {
                if (coinbase) {
                    return coinbaseCharge(payload, (err, data) => {
                        if (err) {
                            console.log(err)
                            return res.status(400).send({data: 'Something went wrong creating the payment. Try again later.'})
                        }

                        return res.send(data)
                    })
                } else {
                    makeCharge(obj, (err, data) => {
                        if (err) {
                            return res.status(500).send({
                                error: true,
                                message: 'Internal server error.'
                            })
                        }

                        updateExpiry(payload, (err, data) => {
                            if (err) {
                                console.log(err)
                                return res.status(500).send({
                                    error: true,
                                    message: 'Success'
                                })    
                            }

                            return res.status(200).send({
                                message: 'Success'
                            })
                        })
                    })
                }
            } else {
                return res.status(403).send({
                    error: true,
                    message: 'You are not authorized to do that'
                })
            }
        })
}
