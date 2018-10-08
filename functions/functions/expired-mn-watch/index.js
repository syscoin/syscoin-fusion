const functions = require('firebase-functions')
const admin = require('firebase-admin')
const async = require('async')

const getKeyId = require('../helpers/get-keys-id')
const deleteDropletByKey = require('../helpers/delete-droplet-by-key')

module.exports = functions.pubsub.topic('expired-mn-watch').onPublish(event => {
    return new Promise((resolve, reject) => {
        admin.database().ref('/orders')
        .once('value', ev => {
            const data = ev.val()
            const keys = Object.keys(data)

            async.each(keys, (i, done) => {
                if (data[i].expiresOn < Date.now()) {
                    admin.database().ref('/mn-data')
                        .orderByChild('orderId')
                        .equalTo(i)
                        .once('value', event => {
                            const data = event.val()
                            const key = Object.keys(data)[0]

                            const { orderId, vpsId } = data[key]

                            getKeyId(vpsId, (err, keyId) => {
                                if (err) {
                                    done('Cant find key')
                                    return false
                                }

                                deleteDropletByKey(vpsId, (err) => {
                                    if (err) {
                                        console.log('Cant find vpsid ' + vpsId + ' in DO. Deleting records')
                                    }

                                    async.parallel([
                                        cb => {
                                            admin.database().ref('/keys/' + keyId).remove().then(() => cb()).catch(() => cb())
                                        },
                                        cb => {
                                            admin.database().ref('/mn-data/' + key).remove().then(() => cb()).catch(() => cb())
                                        },
                                        cb => {
                                            admin.database().ref('/vps/' + vpsId).remove().then(() => cb()).catch(() => cb())
                                        },
                                        cb => {
                                            admin.database().ref('/orders/' + orderId).remove().then(() => cb()).catch(() => cb())
                                        }
                                    ], () => {
                                        console.log('Deleted order ' + orderId)
                                        done()
                                    })
                                })
                            })
                        })
                } else {
                    return done()
                }
            }, (error) => {
                if (error) {
                    console.log(error)
                }

                return resolve()
            })
        })
    })
})