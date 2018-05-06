const functions = require('firebase-functions')
const admin = require('firebase-admin')
const async = require('async')

module.exports = functions.pubsub.topic('deploy-queue-clean').onPublish(event => {
    return admin.database().ref('/to-deploy')
                    .orderByChild('deployed')
                    .equalTo(true)
                    .once('value', ev => {
                        if (!ev.hasChildren()) {
                            console.log('Nothing to clean!')
                            return true
                        }
                        const data = ev.val()
                        const keys = Object.keys(data)

                        keys.forEach(i => {
                            admin.database().ref('/to-deploy/' + i).set(null)
                        })
                    })
})