const firebase = require('firebase-functions')
const admin = require('firebase-admin')
const async = require('async')

const makeCharge = require('./helpers/make-charge')
const coinbaseCharge = require('./helpers/coinbase-charge')
const createDroplet = require('./helpers/create-droplet')
const getDropletIp = require('./helpers/get-droplet-ip')
const redeemCode = require('./helpers/redeem-code')

module.exports = (req, res, next) => {
    // Handles new Masternode orders
    try {
        let token = req.body.token,
            months = req.body.months,
            email = req.body.email
            mnKey = req.body.key,
            mnTxid = req.body.txid,
            mnName = req.body.name,
            mnIndex = req.body.index,
            method = req.body.method,
            code = req.body.code,
            nodeType = req.body.nodeType || 'sys'

        const cryptoPaymentsSupported = ['btc', 'ltc', 'bch', 'eth']

        if (method === 'cc') {

            token = token.token

            if (token.error) {
                // If the token has an error, return 400
                return res.status(400).send({ error: token.error.message })
            }
    
            return makeCharge({
                email,
                months,
                tokenId: token.id
            }, (err, charge) => {
                if (err) {
                    return res.status(400).send({
                        error: true,
                        message: 'Something went wrong during the payment. Try again later.'
                    })
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
                    paymentMethod: 'cc',
                    nodeType
                })
    
                return res.send({
                    message: 'Payment completed',
                    expiresOn: new Date().setMonth(new Date().getMonth() + parseInt(months)),
                    purchaseDate: Date.now(),
                    paymentId: charge.id
                })
            })
        } else if (method === 'code') {
            redeemCode({
                email: req.user.email,
                code
            }, (err, data) => {
                if (err) {
                    return res.status(400).send({
                        error: true,
                        message: 'Invalid code'
                    })
                }

                admin.database().ref('/to-deploy').push({
                    months: data.months,
                    mnKey,
                    mnTxid,
                    mnName,
                    mnIndex,
                    lock: false,
                    lockDate: null,
                    orderDate: Date.now(),
                    paymentId: code,
                    deployed: false,
                    userId: req.user.uid,
                    paymentMethod: 'code',
                    nodeType
                })
    
                return res.send({
                    message: 'Payment completed',
                    expiresOn: new Date().setMonth(new Date().getMonth() + parseInt(data.months)),
                    purchaseDate: Date.now(),
                    paymentId: code
                })
            })
        } else if (cryptoPaymentsSupported.indexOf(method) !== -1) {
            return coinbaseCharge({   
                months,
                email,
                mnKey,
                mnTxid,
                mnName,
                mnIndex,
                method,
                userId: req.user.uid
            },  (err, charge) => {
                if (err) {
                    return res.status(400).send({
                        error: true,
                        message: 'Something went wrong during the payment. Try again later.'
                    })
                }

                return res.send({charge})
            })
        } else {
            return res.status(400).send({
                error: true,
                message: 'Something went wrong during the payment. Try again later.'
            })
        }

        
    } catch (err) {
        return next(err)
    }

}
