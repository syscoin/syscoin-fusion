const functions = require('firebase-functions')
const admin = require('firebase-admin')
const async = require('async')

const createDroplet = require('../../endpoints/helpers/create-droplet')
const getDropletIp = require('../../endpoints/helpers/get-droplet-ip')
const deleteDropletById = require('../../endpoints/helpers/delete-droplet-id')

module.exports = functions.pubsub.topic('deploy').onPublish(event => {
    return admin.database().ref('/to-deploy')
        .orderByChild('deployed')
        .equalTo(false)
        .once('value', snapshot => {

            if (!snapshot.hasChildren()) {
                console.log('Nothing to deploy!')
                return true
            }

            const snap = snapshot.val()
            const keys = Object.keys(snap)

            async.each(keys, (i, callback) => {
                const {
                    mnKey,
                    mnTxid,
                    mnName,
                    mnIndex,
                    months
                } = snap[i]
                let dropletId = null

                async.waterfall([
                    (cb) => {
                        // Creates droplet and generate keys
                        createDroplet((err, data) => {
                            if (err) {
                                return cb(err)
                            }

                            dropletId = data.droplet.droplet.id

                            // Gets IP address of newly created droplet
                            setTimeout(() => {
                                getDropletIp(data.droplet.droplet.id, (err, ip) => {
                                    if (err) {
                                        return cb(err)
                                    }

                                    data.ip = ip
                                    return cb(null, data)
                                })
                            }, 20000)

                        })
                    },
                    (dropletData, cb) => {
                        // Saves order info
                        admin.database().ref('/orders').push({
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
                        admin.database().ref('/vps').push({
                            userId: snap[i].userId,
                            orderId: order.key,
                            status: 'offline',
                            lastUpdate: Date.now(),
                            uptime: 0,
                            vpsid: dropletData.droplet.droplet.id,
                            ip: dropletData.ip
                        }).then((vps) => {
                            return cb(null, dropletData, order, vps)
                        }).catch(err => cb(err))
                    },
                    (dropletData, order, vps, cb) => {
                        // Saves keys info
                        admin.database().ref('/keys').push({
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
                        admin.database().ref('/mn-data').push({
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
                            deleteDropletById(dropletId)
                        }
                        return callback(null)
                    }

                    console.log('Deployed ' + i)

                    admin.database().ref('/to-deploy/' + i).update({
                        deployed: true
                    }).then(() => callback()).catch(err => callback(err))
                })
            }, (err) => {
                if (err) {
                    return false
                }

                console.log('All OK')
            })

        })
})
