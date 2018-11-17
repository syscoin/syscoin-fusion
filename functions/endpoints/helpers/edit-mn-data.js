const admin = require('firebase-admin')

/**
 * @api {post} /edit-node Edit node
 * @apiDescription Needs firebase authentication - You need to send ALL these fields, even if you want to edit only one
 * @apiGroup Endpoints
 * 
 * @apiParam {String} mnIndex new MN index
 * @apiParam {String} mnKey new MN key
 * @apiParam {String} mnName new MN name
 * @apiParam {String} mnTxid new MN txid
 * @apiParam {String} mnRewardAddress SYS address where user is receiving rewards
 * @apiParam {String} id mn-data DB id
 * 
 * @apiSuccessExample {json} Success
 *  {
        error: false
    }
 */
module.exports = (orderId, cb) => {
    admin.database().ref('/mn-data')
        .orderByChild('orderId')
        .equalTo(orderId)
        .once('value', snapshot => {
            const data = snapshot.val()

            if (!snapshot.hasChildren()) {
                return cb('You are not allowed to do that')
            }
            admin.database().ref('/mn-data/' + orderId +'/chargeLastMadeAt')
            .set(Date.now())
            .then(() => cb())
            .catch(() => cb('Internal server error'))
    }).catch(() => cb('Internal server error'))
}