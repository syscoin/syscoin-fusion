const admin = require('firebase-admin')
const deleteMn = require('../functions/expired-mn-watch/delete-mn')
const deleteAwsMn = require('../functions/helpers/aws/delete-node')

/**
 * @api {post} /edit-node Edit node
 * @apiDescription Needs firebase authentication - You need to send ALL these fields, even if you want to edit only one
 * @apiGroup Endpoints
 * 
 * @apiParam {String} vpsId VPS key
 * 
 * @apiSuccessExample {json} Success
 *  {
        error: false
    }
 */
module.exports = async (req, res, next) => {
    const { vpsId } = req.body

    let vps,  vpsKey

    try {
        vps = await admin.database().ref('/vps/' + vpsId).once('value')
        vpsKey = Object.keys(vps)[0]
    } catch(err) {
        return res.status(404).send({
            error: true,
            message: 'Masternode not found'
        })
    }

    try {
        if (vps.vpsOrigin === 'aws') {
            await deleteAwsMn(vpsKey, vps.allocationId)
        } else {
            await deleteMn(vps.orderId)
        }
    }
}
