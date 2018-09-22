const firebase = require('firebase-functions')
const admin = require('firebase-admin')
const async = require('async')

const makeCharge = require('./helpers/make-charge')
const coinbaseCharge = require('./helpers/coinbase-charge')
const createDroplet = require('./helpers/create-droplet')
const getDropletIp = require('./helpers/get-droplet-ip')
const redeemCode = require('./helpers/redeem-code')

/**
 * @api {post} /payment Node payment and creation
 * @apiDescription Needs firebase authentication
 * @apiGroup Endpoints
 * 
 * @apiParam {String} [token] Payment token received from Stripe - Required only if the payment method is 'cc'
 * @apiParam {Number} months Number of paid months
 * @apiParam {String} email User email
 * @apiParam {String} mnKey Masternode key provided by the user
 * @apiParam {String} mnTxid Masternode txid provided by the user
 * @apiParam {String} mnName Masternode name provided by the user
 * @apiParam {String} mnIndex Masternode index provided by the user
 * @apiParam {String} method Payment method
 * @apiParam {String} [code] Coupon code - required only if method is 'code'
 * @apiParam {String} nodeType Coin selected
 * @apiSuccessExample {json} Success
 * {
	"message": "Payment completed",
	"expiresOn": 1535238405885,
	"purchaseDate": 1532560005885,
	"paymentId": "ch_1Crw48JiaRVP2JosFEAzwu82"
}
 */
module.exports = (req, res, next) => {
    // Handles new Masternode orders
    try {
        let token = req.body.token,
            months = req.body.months,
            email = req.body.email
            mnKey = req.body.mnKey,
            mnTxid = req.body.mnTxid,
            mnName = req.body.mnName,
            mnIndex = req.body.mnIndex,
            method = req.body.method,
            code = req.body.code,
            nodeType = req.body.nodeType || 'sys'

        const cryptoPaymentsSupported = ['btc', 'ltc', 'bch', 'eth']

        if (method === 'cc') {
    
            return makeCharge({
                email,
                months,
                tokenId: token
            }, (err, charge) => {
                if (err) {
                    return res.status(400).send({
                        error: true,
                        message: 'Something went wrong during the payment. Try again later.'
                    })
                }
    
                admin.database().ref('/to-deploy/tasks').push({
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

                admin.database().ref('/to-deploy/tasks').push({
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
