const coinbaseCharge = require('./helpers/coinbase-charge')

/**
 * @api {post} /crypto-charge Add funds to wallet - Crypto
 * @apiDescription Needs firebase authentication
 * @apiGroup Endpoints
 * 
 * @apiParam {Number} chargeAmount Number of paid months
 * @apiParam {String} method Crypto payment method
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
            method: req.body.method,
            userId: req.user.uid
        },  (err, charge) => {
            if (err) {
                console.log("Error creating crypto charge: ", err)
                
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
