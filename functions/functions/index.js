const firebase = require('firebase-admin')
const functions = require('firebase-functions')
const async = require('async')

const writeConfigToDroplet = require('./helpers/write-config-to-droplet')

const nodemailer = require('./email')
const statusTemplate = require('./email/templates/status_change')
const newDeployTemplate = require('./email/templates/new_deploy')

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

    return new Promise((resolve, reject) => {
        async.parallel([
            cb => {
                firebase.database().ref('/vps')
                        .orderByChild('orderId')
                        .equalTo(mnData.orderId)
                        .once('value', snapshot => {
                            const snap = snapshot.val()
                            const objKey = Object.keys(snap)[0]
    
                            snap[objKey].vpsKey = objKey
    
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
                reject(err)
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
                    reject(err)
                    return err
                }

                admin.database().ref('/vps/' + vpsData.vpsKey).update({
                    lock: false
                }).then(() => resolve()).catch(err => reject(err))
            })
    
        })
    })
})

exports.emailUserOnStatusChange = functions.database.ref('/vps/{id}').onUpdate(ev => {
    const oldData = ev.data.previous.val()
    const nextData = ev.data.val()

    if (oldData.status !== nextData.status) {
        return firebase.database().ref('/mn-data')
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
                                from: 'notification@masterminer.tech',
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

exports.emailOnDeploy = functions.database.ref('/to-deploy/{id}').onCreate(event => {
    const data = event.data.toJSON()

    return firebase.auth().getUser(data.userId)
            .then(userRecord => {
                const user = userRecord.toJSON()

                return nodemailer.sendMail({
                    from: 'notification@masterminer.tech',
                    to: user.email,
                    subject: `Your new Masternode is on the way!`,
                    html: newDeployTemplate(data.mnName)
                })
            })
            .catch(error => console.log(error))
})
