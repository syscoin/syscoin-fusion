const admin = require('firebase-admin')
const updateBalance = require('./helpers/update-balance')

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
            amount = parseFloat(req.body.chargeAmount) * -100,
            email = req.body.email
            mnKey = req.body.mnKey,
            mnTxid = req.body.mnTxid,
            mnName = req.body.mnName,
            mnIndex = req.body.mnIndex,
            uid = req.user.uid,
            nodeType = req.body.nodeType || 'sys'

        return updateBalance(
            uid,
            amount,
            (err) => {
                if (err) {
                    console.log("Error in update balance")
                    return res.status(400).send({
                        error: true,
                        message: err
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
                paymentId: 'XYZ',
                deployed: false,
                userId: req.user.uid,
                paymentMethod: 'cc',
                nodeType
            })

            return res.send({
                message: 'Payment completed',
                expiresOn: new Date().setMonth(new Date().getMonth() + parseInt(months)),
                purchaseDate: Date.now(),
                paymentId: 'XYZ'
            })
        })
    } catch (err) {
        return next(err)
    }

}
