const functions = require('firebase-functions')
const admin = require('firebase-admin')
const async = require('async')

module.exports = functions.pubsub.topic('vps-status-queue-clean').onPublish(event => {
    return admin.database().ref('/vps')
                    .orderByChild('lock')
                    .equalTo(true)
                    .once('value', ev => {
                        const data = ev.val()
                        const keys = Object.keys(data)

                        keys.forEach(i => {
                            if ((Date.now() - data[i].lastUpdate) > 100000) {
                                admin.database().ref('/vps/' + i).update({
                                    lock: false
                                })
                            }
                        })
                    })
})