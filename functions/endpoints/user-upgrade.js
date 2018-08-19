const functions = require('firebase-functions')
const admin = require('firebase-admin')

const upgradeMn = require('../functions/helpers/upgrade-mn')
const saveMnStatus = require('../functions/helpers/save-vps-status')

module.exports = (req, res) => {
    const userId = req.user.uid,
          dropletId = req.body.dropletId

    const imageId = functions.config().dropletconfig.imageid

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
                            dropletId
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
