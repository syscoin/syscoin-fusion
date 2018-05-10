const admin = require('firebase-admin')
const functions = require('firebase-functions')

module.exports = functions.pubsub.topic('deploy-queue-unlock').onPublish(event => {
    return admin.database().ref('/to-deploy')
                .orderByChild('deployed')
                .equalTo(false)
                .once('value', (snapshot) => {
                    const snap = snapshot.val()
                    const keys = Object.keys(snap)

                    keys.forEach(i => {
                        if (snap[i].lockDate && (Date.now() - snap[i].lockDate) > 300000) {
                            admin.database().ref('/to-deploy/' + i).update({
                                lockDate: null,
                                lock: false
                            })
                        }
                    })
                })
})
