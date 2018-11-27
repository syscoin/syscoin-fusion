const admin = require('firebase-admin')

const updateBalance = require('./helpers/update-balance')

/**
 * @api {post} /extend-subscription Extend subscription
 * @apiGroup Endpoints
 * 
 * @apiParam {String} orderId Order database ID
 * @apiParam {String} tokenId Stripe token
 * @apiParam {Number} months Numbr of months to extend
 * @apiParam {String} email User email
 * @apiParam {Boolean} coinbase Coinbase payment
 * @apiParam {String} code Use code to extend MN
 * @apiParam {String="cc","coin", "code"} paymentMethod Payment method
 * 
 * @apiSuccessExample {json} Success
 *  {
        message: 'Success'
    }
 */
module.exports = (req, res, next) => {
    const { orderId, tokenId, months, email, type, chargeAmount } = req.body

    return admin.database().ref('/orders/' + orderId)
        .once('value', snapshot => {
            const snaps = snapshot.val()

            if (snaps.userId === req.user.uid) {
                return updateBalance(
                    req.user.uid,
                    parseFloat(chargeAmount) * -100,
                    (err) => {
                        if (err) {
                            console.log("Error in update balance")
                            return res.status(400).send({
                                error: true,
                                message: err
                            })
                        }
        
                        return res.send({
                            message: 'Success'
                        })
                })
            } else {
                return res.status(403).send({
                    error: true,
                    message: 'You are not authorized to do that'
                })
            }
        })
}
