const functions = require('firebase-functions')
const admin = require('firebase-admin')
const async = require('async')

const createDroplet = require('../../endpoints/helpers/create-droplet')
const getDropletIp = require('../../endpoints/helpers/get-droplet-ip')
const deleteDropletById = require('../../endpoints/helpers/delete-droplet-id')
const lockDeploys = require('../helpers/lock-deploys')
const addIpToWhiteList = require('../helpers/add-ip-to-whitelist')

module.exports = functions.pubsub.topic('deploy').onPublish(event => {
    return admin.database().ref('/to-deploy')
        .orderByChild('lock')
        .equalTo(false)
        .limitToFirst(2)
        .once('value').then(snapshot => {

            return new Promise((resolve, reject) => {
                console.log('Queue started')

                if (!snapshot.hasChildren()) {
                    console.log('Nothing to deploy!')
                    return resolve()
                }

                const snap = snapshot.val()
                const keys = Object.keys(snap)

                lockDeploys(keys, () => {
                    async.each(keys, (i, callback) => {
                        const {
                            mnKey,
                            mnTxid,
                            mnName,
                            mnIndex,
                            months,
                            nodeType
                        } = snap[i]
                        let dropletId = null

                        async.waterfall([
                            (cb) => {
                                // Creates droplet and generate keys
                                return new Promise((dropletResolve, dropletReject) => {
                                    createDroplet(nodeType, (err, data) => {
                                        if (err) {
                                            return cb(err)
                                        }
    
                                        dropletId = data.droplet.droplet.id
    
                                        // Gets IP address of newly created droplet
                                        setTimeout(() => {
                                            getDropletIp(data.droplet.droplet.id, (err, ip) => {
                                                if (err) {
                                                    dropletReject(err)
                                                    return cb(err)
                                                }
    
                                                data.ip = ip
                                                dropletResolve()
                                                return cb(null, data)
                                            })
                                        }, 15000)
    
                                    })
                                })
                            },
                            (dropletData, cb) => {
                                addIpToWhiteList(dropletData.ip, (err) => {
                                    if (err) {
                                        return cb(err)
                                    }

                                    return cb(null, dropletData)
                                })
                            },
                            (dropletData, cb) => {
                                // Saves order info
                                return admin.database().ref('/orders').push({
                                    nodeType,
                                    userId: snap[i].userId,
                                    expiresOn: new Date().setMonth(new Date().getMonth() + parseInt(months)),
                                    purchaseDate: Date.now(),
                                    numberOfMonths: parseInt(months),
                                    totalCharge: parseInt(months) * 15,
                                    paymentId: snap[i].paymentId
                                }).then((order) => {
                                    return cb(null, dropletData, order)
                                }).catch(err => {
                                    cb(err)
                                })
                            },
                            (dropletData, order, cb) => {
                                // Saves dropletInfo
                                return admin.database().ref('/vps').push({
                                    userId: snap[i].userId,
                                    orderId: order.key,
                                    status: 'Offline: will update shortly',
                                    lastUpdate: Date.now() - 1500000,
                                    lock: true,
                                    uptime: 0,
                                    vpsid: dropletData.droplet.droplet.id,
                                    ip: dropletData.ip,
                                    imageId: functions.config().dropletconfig.imageid
                                }).then((vps) => {
                                    return cb(null, dropletData, order, vps)
                                }).catch(err => cb(err))
                            },
                            (dropletData, order, vps, cb) => {
                                // Saves keys info
                                return admin.database().ref('/keys').push({
                                    sshkey: dropletData.keys.keys.priv.enc,
                                    typeLength: dropletData.keys.keys.priv.typeLength,
                                    vpsId: vps.key,
                                    userId: snap[i].userId,
                                    orderId: order.key
                                }).then((key) => {
                                    return cb(null, dropletData, order, vps, key)
                                }).catch(err => cb(err))
                            },
                            (dropletData, order, vps, key, cb) => {
                                // Saves mn data
                                return admin.database().ref('/mn-data').push({
                                    vpsId: vps.key,
                                    userId: snap[i].userId,
                                    orderId: order.key,
                                    mnKey,
                                    mnTxid,
                                    mnName,
                                    mnIndex
                                }).then((mndata) => {
                                    return cb(null, dropletData, order, vps, key, mndata)
                                }).catch(err => cb(err))
                            }
                        ], (err) => {
                            if (err) {
                                console.log('Failed for payment ' + snap[i].paymentId + '. Retrying in the next iteration')
                                if (dropletId) {
                                    return new Promise((deleteResolve, deleteReject) => {
                                        deleteDropletById(dropletId, (err) => {
                                            if (err) {
                                                return deleteReject(err)
                                            }
                                            deleteResolve()
                                            callback(null)
                                        })
                                    })
                                }
                                callback(err)
                                return false
                            }

                            console.log('Deployed ' + i)

                            return admin.database().ref('/to-deploy/' + i).update({
                                deployed: true
                            }).then(() => callback()).catch(err => callback(err))
                        })
                    }, (err) => {
                        if (err) {
                            reject(err)
                            return false
                        }

                        resolve()

                        console.log('All OK')
                    })
                })
            })

        }).catch(err => {
            return err
        })
})
