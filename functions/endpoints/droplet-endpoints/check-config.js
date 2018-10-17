const admin = require('firebase-admin')
const functions = require('firebase-functions')
const async = require('async')
const moment = require('moment')

const upgradeMn = require('../../functions/helpers/upgrade-mn')

/**
 * @api {get} /droplets/get-mn-data Get MN data
 * @apiDescription Goes through API filter - Returns all MN data so the droplet can check if it has the correct config. If not, will reconfigure and restart.
 * @apiGroup Droplets Endpoints
 * 
 * @apiSuccessExample {json} Success
 *  {
        mnIndex: String,
        mnKey: String,
        mnName: String,
        mnTxid: String,
        ip: String,
        mnRewardAddress: String,
        nodeType: String
    }
 */
module.exports = (req, res, next) => {
    const clientIp = (req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress).split(",")[0]

    async.waterfall([
        (cb) => {
            admin.database().ref('/vps')
                .orderByChild('ip')
                .equalTo(clientIp)
                .once('value', snapshot => {
                    if (snapshot.hasChildren()) {
                        const key = Object.keys(snapshot.val())[0]
                        const data = snapshot.val()[key]

                        return cb(null, {
                            vpsKey: key,
                            orderId: data.orderId,
                            imageId: data.imageId,
                            vpsid: data.vpsid
                        })
                    } else {
                        return cb({
                            message: 'Not a masternode',
                            error: true,
                            status: 404
                        })
                    }
                }).catch(() => cb({
                    error: true,
                    message: 'Internal Server Error.',
                    status: 500
                }))
        },
        (vpsData, cb) => {
            admin.database().ref('/mn-data')
                .orderByChild('vpsId')
                .equalTo(vpsData.vpsKey)
                .once('value', snapData => {
                    const mnKey = Object.keys(snapData.val())[0]
                    const data = snapData.val()[mnKey]

                    return cb(null, {
                        mnIndex: data.mnIndex,
                        mnKey: data.mnKey,
                        mnName: data.mnName,
                        mnTxid: data.mnTxid,
                        ip: clientIp,
                        mnRewardAddress: data.mnRewardAddress || '',
                        nodeType: data.nodeType,
                        vpsImageId: vpsData.imageId,
                        vpsid: vpsData.vpsid,
                        vpsKey: vpsData.vpsKey
                    })
                })
        },
        (data, cb) => {
            const actualImageId = functions.config().images[data.nodeType.toLowerCase()]
            const updateMaxDate = functions.config().images[data.nodeType.toLowerCase() + '_max_date']

            if (data.vpsImageId !== actualImageId && moment() >= moment(updateMaxDate)) {
                return upgradeMn({
                    dropletId: data.vpsid
                }, (err) => {
                    if (err) {
                        return cb({
                            error: true,
                            message: 'Something went wrong',
                            status: 500
                        })
                    }

                    return admin.database().ref('/vps/' + data.vpsKey).update({
                        imageId: actualImageId
                    }).then(() => {
                        return cb({
                            error: true,
                            message: 'Masternode is upgrading',
                            status: 422
                        })
                    }).catch(() => cb({
                        error: true,
                        message: 'Something went wrong',
                        status: 500
                    }))
                })
            }

            delete data.vpsKey
            delete data.vpsid

            return cb(null, data)
        },
    ], (err, mnData) => {
        if (err) {
            return res.status(err.status).send(err)
        }

        return res.status(200).send(mnData)
    })

}
