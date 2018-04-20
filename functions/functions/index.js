const firebase = require('firebase-admin')
const functions = require('firebase-functions')
const async = require('async')

const writeConfigToDroplet = require('./helpers/write-config-to-droplet')

exports.writeConfigToDroplet = functions.database.ref('/mn-data/{id}').onCreate(ev => {
    const key = ev.key
    const mnData = ev.data.val()

    async.parallel([
        cb => {
            firebase.database().ref('/vps')
                    .orderByChild('orderId')
                    .equalTo(mnData.orderId)
                    .once('value', snapshot => {
                        const snap = snapshot.val()
                        const objKey = Object.keys(snap)[0]

                        cb(null, snap[objKey])
                    })
        },
        cb => {
            firebase.database().ref('/keys')
                    .orderByChild('orderId')
                    .equalTo(mnData.orderId)
                    .once('value', snapshot => {
                        const snap = snapshot.val()
                        const objKey = Object.keys(snap)[0]

                        cb(null, snap[objKey])
                    })
        }
    ], (err, data) => {
        if (err) {
            return err
        }

        const vpsData = data[0]
        const keysData = data[1]

        setTimeout(() => {
            writeConfigToDroplet({
                ip: vpsData.ip,
                encryptedSsh: keysData.sshkey,
                typeLength: keysData.typeLength,
                mnKey: mnData.mnKey
            }, (err) => {
                if (err) {
                    return err
                }
            })
        }, /*300000*/ 90000)
    })
})

exports.editNodeData = functions.database.ref('/mn-data/{id}').onUpdate(ev => {
    const key = ev.key
    const mnData = ev.data.val()

    async.parallel([
        cb => {
            firebase.database().ref('/vps')
                    .orderByChild('orderId')
                    .equalTo(mnData.orderId)
                    .once('value', snapshot => {
                        const snap = snapshot.val()
                        const objKey = Object.keys(snap)[0]

                        cb(null, snap[objKey])
                    })
        },
        cb => {
            firebase.database().ref('/keys')
                    .orderByChild('orderId')
                    .equalTo(mnData.orderId)
                    .once('value', snapshot => {
                        const snap = snapshot.val()
                        const objKey = Object.keys(snap)[0]

                        cb(null, snap[objKey])
                    })
        }
    ], (err, data) => {
        if (err) {
            return err
        }

        const vpsData = data[0]
        const keysData = data[1]

        writeConfigToDroplet({
            ip: vpsData.ip,
            encryptedSsh: keysData.sshkey,
            typeLength: keysData.typeLength,
            mnKey: mnData.mnKey
        }, (err) => {
            if (err) {
                return err
            }
        })

    })

    return true
})
