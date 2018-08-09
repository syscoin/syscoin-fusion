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
        ip: String
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
                        const maxDate = moment(functions.config().dropletconfig.max_upgrade_date, 'YYYY-MM-DD')

                        if (
                            snapshot.val()[key].imageId !== functions.config().dropletconfig.imageid &&
                            maxDate < moment()
                        ) {
                            return upgradeMn({
                                dropletId: snapshot.val()[key].vpsid
                            }, (err) => {
                                if (err) {
                                    return cb({
                                        error: true,
                                        message: 'Something went wrong',
                                        status: 500
                                    })
                                }

                                return admin.database().ref('/vps/' + key).update({
                                    imageId: functions.config().dropletconfig.imageid
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

                        return cb(null, key)
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
        (vpsKey, cb) => {
            admin.database().ref('/mn-data')
                .orderByChild('vpsId')
                .equalTo(vpsKey)
                .once('value', snapData => {
                    const mnKey = Object.keys(snapData.val())[0]
                    const data = snapData.val()[mnKey]

                    return cb(null, {
                        mnIndex: data.mnIndex,
                        mnKey: data.mnKey,
                        mnName: data.mnName,
                        mnTxid: data.mnTxid,
                        ip: clientIp,
                        mnRewardAddress: data.mnRewardAddress
                    })
                })
        }
    ], (err, mnData) => {
        if (err) {
            return res.status(err.status).send(err)
        }

        return res.status(200).send(mnData)
    })

}
