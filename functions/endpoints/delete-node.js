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
        error: false,
        message: 'Success.'
    }
 */
module.exports = async (req, res, next) => {
    const { vpsId } = req.body

    if (!vpsId) {
        return res.status(400).send({
            error: true,
            message: 'Missing required parameter'
        })
    }

    let vps,  vpsKey

    try {
        vps = await admin.database().ref('/vps/' + vpsId).once('value')
        vps = vps.val()
        vpsKey = Object.keys(vps)[0]
    } catch(err) {
        return res.status(404).send({
            error: true,
            message: 'Masternode not found'
        })
    }

    try {
        if (vps.vpsOrigin === 'aws') {
            await deleteAwsMn(vps.vpsid, vps.allocationId)
        } else {
            await deleteMn(vps.orderId)
        }
    } catch(err) {
        console.log(err)
        return res.status(500).send({
            error: true,
            message: 'Error while trying to delete node'
        })
    }

    try {
        await admin.database().ref('/orders/' + vps.orderId).remove()
        await admin.database().ref('/mn-data/' + vps.mnDataId).remove()
        await admin.database().ref('/vps/' + vpsKey).remove()
    } catch(err) {
        console.log(err)
        return req.status(500).send({
            error: true,
            message: 'Error while trying to delete logs'
        })
    }

    return res.send({
        error: false,
        message: 'Success'
    })
}
