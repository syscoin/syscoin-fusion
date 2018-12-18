const firebase = require('firebase-functions')
const admin = require('firebase-admin')
const async = require('async')

/**
 * @api {get} /wallet/balance Get user balance
 * @apiDescription Needs firebase authentication - no params taken. Balance returned in cents.
 * @apiGroup Endpoints
 * 
 * @apiSuccessExample {json} Success
 * {
    error: false,
	balance: 12345
}
 */
module.exports = async (req, res, next) => {
    let balance

    try {
        balance = await admin.database().ref('/balance/' + req.user.uid).once('value')
        balance = balance.val()
    } catch(err) {
        return res.send({
            error: false,
            balance: 0
        })
    }

    return res.send({
        error: false,
        balance
    })
}
