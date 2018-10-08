const coinbaseCharge = require('./helpers/coinbase-charge')

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
        let chargeAmount = req.body.chargeAmount
            
        return coinbaseCharge({   
            chargeAmount,
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
        
    } catch (err) {
        return next(err)
    }

}
