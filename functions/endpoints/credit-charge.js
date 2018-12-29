const makeCharge = require('./helpers/make-charge')
const updateBalance = require('./helpers/update-balance')


/**
 * @api {post} /credit-charge Add funds to wallet - CC
 * @apiDescription Needs firebase authentication
 * @apiGroup Endpoints
 * 
 * @apiParam {String} [token] Payment token received from Stripe - Required only if the payment method is 'cc'
 * @apiParam {Number} amount Amount added to wallet
 * @apiParam {String} email User email
 * @apiSuccessExample {json} Success
 * {
	"message": "Payment completed",
	"expiresOn": 1535238405885,
	"purchaseDate": 1532560005885,
	"paymentId": "ch_1Crw48JiaRVP2JosFEAzwu82"
}
 */
module.exports = (req, res, next) => {
    try {
        let tokenId = req.body.token,
            chargeAmount = req.body.amount * 100,
            email = req.body.email

        return makeCharge({
            email,
            chargeAmount,
            tokenId
        }, (err, charge) => {
            if (err) {
                return res.status(400).send({
                    error: true,
                    message: 'Something went wrong during the payment. Try again later.'
                })
            }
            updateBalance(req.user.uid, chargeAmount, (err) => {
                if (err) {
                    return res.status(400).send({
                        error: true,
                        message: 'Error updating balance. Contact support'
                    })
                }

                return res.send({
                    message: 'Payment completed',
                    expiresOn: new Date().setMonth(new Date().getMonth()),
                    purchaseDate: Date.now(),
                    paymentId: charge.id
                })
            })
        })
    } catch (err) {
        return next(err)
    }

}
