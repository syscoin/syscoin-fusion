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
            message: 'Invalid coin.'
        })
    }

    return admin.database().ref('/vps')
                    .orderByChild('userId')
                    .equalTo(userId)
                    .once('value', (snapshot) => {
                        if (!snapshot.hasChildren()) {
                            return res.status(404).send({
                                error: true,
                                message: 'Something went wrong.'
                            })
                        }

                        const data = snapshot.val()
                        const keys = Object.keys(data)
                        const key = keys.find(i => data[i].vpsid === dropletId)

                        if (!key) {
                            return res.status(404).send({
                                error: true,
                                message: 'Thats not a valid Masternode.'
                            })
                        }

                        if (data[key].imageid === imageId) {
                            return res.status(422).send({
                                error: true,
                                message: 'This Masternode is up to date.'
                            })
                        }

                        upgradeMn({
                            dropletId,
                            nodeType: imageId
                        }, (err, data) => {
                            if (err) {
                                return res.status(500).send({
                                    error: true,
                                    message: 'Something went wrong.'
                                })
                            }

                            saveMnStatus({
                                vpsId: key,
                                configFile: data.configFile,
                                status: data.status,
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
                        })
                    })
}
