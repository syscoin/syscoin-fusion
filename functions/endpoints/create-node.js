const firebase = require('firebase-functions')
const admin = require('firebase-admin')
const async = require('async')

const makeCharge = require('./helpers/make-charge')
const coinbaseCharge = require('./helpers/coinbase-charge')
const createDroplet = require('./helpers/create-droplet')
const getDropletIp = require('./helpers/get-droplet-ip')

module.exports = (req, res, next) => {
    // Handles new Masternode orders
    try {
        const token = req.body.token.token,
            months = req.body.months,
            email = req.body.email
            mnKey = req.body.key,
            mnTxid = req.body.txid,
            mnName = req.body.name,
            mnIndex = req.body.index,
            type = req.body.type

        if (token.error) {
            // If the token has an error, return 400
            return res.status(400).send({ error: token.error.message })
        }

        if (type === 1) {
            return makeCharge({
                email,
                months,
                tokenId: token.id
            }, (err, charge) => {
                if (err) {
                    console.log(err)
                    return res.status(400).send({data: 'Something went wrong during the payment. Try again later.'})
                }

                admin.database().ref('/to-deploy').push({
                    months,
                    mnKey,
                    mnTxid,
                    mnName,
                    mnIndex,
                    lock: false,
                    lockDate: null,
                    orderDate: Date.now(),
                    paymentId: charge.id,
                    deployed: false,
                    userId: req.user.uid,
                })

                return res.send({
                    message: 'Payment completed',
                    expiresOn: new Date().setMonth(new Date().getMonth() + parseInt(months)),
                    purchaseDate: Date.now(),
                    paymentId: charge.id
                })
            })
        }
        if (type === 2) {
            return coinbaseCharge({   
                months,
                email,
                mnKey,
                mnTxid,
                mnName,
                mnIndex,
                userId: req.user.uid,
            }, (err, charge) => {
                if (err) {
                    console.log(err)
                    return res.status(400).send({data: 'Something went wrong during the payment. Try again later.'})
                }

                return res.send({
                    charge
                })
            })
        }
    } catch (err) {
        return next(err)
    }

}
