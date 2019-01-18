const functions = require('firebase-functions')
const admin = require('firebase-admin')

const upgradeMn = require('../functions/helpers/upgrade-mn')
const saveMnStatus = require('../functions/helpers/save-vps-status')

/**
 * @api {post} /upgrade-mn Upgrade MN
 * @apiDescription Needs firebase authentication - Upgrade the version of an specific MN
 * @apiGroup Endpoints
 * 
 * @apiParam {String} dropletId Droplet ID (which can be found in vps collection as "vpsid" property)
 * @apiParam {String} nodeType Node Type (which can be found in orders collection as "nodeType" property)
 * @apiSuccessExample {json} Success
 * {error: false, message: 'Masternode updated successfully.' }
 */
module.exports = (req, res) => {
    const userId = req.user.uid,
        dropletId = req.body.dropletId
        nodeType = req.body.nodeType

    let imageId

    if (!dropletId || !nodeType) {
        return res.status(400).send({
            message: 'Missing required parameter',
            error: true
        })
    }

    if (functions.config().images[nodeType.toLowerCase()]) {
        imageId = functions.config().images[nodeType.toLowerCase()]
    }

    if (!imageId) {
        return res.status(400).send({
            message: 'Invalid coin',
            error: true
        })
    }

    return admin.database().ref('/vps')
        .orderByChild('vpsid')
        .equalTo(dropletId)
        .once('value', snapshot => {
            if (!snapshot.hasChildren()) {
                return res.status(404).send({
                    error: true,
                    message: 'Droplet not found'
                })
            }

            const data = snapshot.val()
            const key = Object.keys(data)[0]

            if (data[key].imageid === imageId) {
                return res.status(422).send({
                    error: true,
                    message: 'This Masternode is up to date'
                })
            }

            if (data[key].vpsOrigin === 'do') {
                return res.status(400).send({
                    error: true,
                    message: 'This node is not allowed to upgrade',
                })
            }

            if (data[key].userId !== userId) {
                return res.status(403).send({
                    error: true,
                    message: 'You are not allowed to upgrade this node'
                })
            }

            upgradeMn({
                dropletId,
                nodeType: imageId
            }).then(data => {

                saveMnStatus(key, {
                    status: 'Node is updating.',
                    imageId: imageId
                }, (err) => {
                    if (err) {
                        return res.status(500).send({
                            error: true,
                            message: 'Something went wrong.'
                        })
                    }

                    return res.status(200).send({
                        error: false,
                        message: 'Masternode updated successfully.'
                    })
                })

            }).catch(() => res.status(500).send({
                error: true,
                message: 'Something went wrong.'
            }))
        })
}
