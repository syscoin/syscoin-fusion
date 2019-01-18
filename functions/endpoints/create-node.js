const admin = require('firebase-admin')
const getNodePrice = require('./helpers/get-node-price')
const getBalance = require('./helpers/get-balance')

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
module.exports = async (req, res, next) => {
    // Handles new Masternode orders
    let token = req.body.token,
        months = req.body.months,
        mnKey = req.body.mnKey,
        mnTxid = req.body.mnTxid,
        mnName = req.body.mnName,
        mnIndex = req.body.mnIndex,
        uid = req.user.uid,
        nodeType = req.body.nodeType || 'sys'

    let nodePrice

    if (months <= 0) {
        return res.status(400).send({
            error: true,
            message: 'Invalid number of months'
        })
    }

    try {
        nodePrice = await getNodePrice(nodeType)
    } catch (err) {
        return res.status(400).send({
            error: true,
            message: 'Invalid node type.'
        })
    }

    // Getting final price
    nodePrice = nodePrice * parseInt(months)

    if (nodePrice === 0) {
        return res.status(400).send({
            error: true,
            message: 'Invalid node type.'
        })
    }

    return getBalance(uid, (err, balance) => {
        if (err) {
            return res.status(400).send({
                error: true,
                message: err
            })
        }

        if (balance < nodePrice) {
            return res.status(403).send({
                error: true,
                message: 'Not enough balance.'
            })
        }

        const paymentId = Date.now()

        admin.database().ref('/to-deploy/tasks').push({
            months,
            mnKey,
            mnTxid,
            mnName,
            mnIndex,
            lock: false,
            lockDate: null,
            orderDate: Date.now(),
            paymentId: paymentId,
            deployed: false,
            userId: req.user.uid,
            paymentMethod: 'cc',
            nodeType
        })

        return res.send({
            message: 'Payment completed',
            expiresOn: new Date().setMonth(new Date().getMonth() + parseInt(months)),
            purchaseDate: paymentId
        })
    })

}
