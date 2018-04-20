const firebase = require('firebase-admin')
const functions = require('firebase-functions')
const async = require('async')

const writeConfigToDroplet = require('./helpers/write-config-to-droplet')

const nodemailer = require('./email')
const statusTemplate = require('./email/templates/status_change')

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
        }, 90000)
    })
})

exports.editNodeData = functions.database.ref('/mn-data/{id}').onUpdate(ev => {
    const key = ev.key
    const mnData = ev.data.val()
    const oldData = ev.data.previous.val()

    if (oldData.mnKey === mnData.mnKey) {
        return false
    }

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

exports.emailUserOnStatusChange = functions.database.ref('/vps/{id}').onUpdate(ev => {
    const oldData = ev.data.previous.val()
    const nextData = ev.data.val()

    if (oldData.status !== nextData.status) {
        firebase.database().ref('/mn-data')
            .orderByChild('orderId')
            .equalTo(nextData.orderId)
            .once('value', snapshot => {
                const snap = snapshot.val()
                const snapKey = Object.keys(snap)[0]
                const mnData = snap[snapKey]

                firebase.auth().getUser(nextData.userId)
                    .then(userRecord => {
                        const user = userRecord.toJSON()

                        return nodemailer.sendMail({
                            from: 'notification@sandbox6351a8c4802147d8bdaa328a7e0386f4.mailgun.org',
                            to: user.email,
                            subject: `Your Masternode ${mnData.mnName} has changed its status`,
                            html: statusTemplate(mnData.mnName, nextData.status)
                        }, (err, info) => {
                            if (err) {
                                console.log(err)
                                return err
                            }

                            console.log('Email sent!')
                        })
                    })
                    .catch(error => console.log(error))
            })
    }
})
