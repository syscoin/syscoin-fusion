const firebase = require('firebase-admin')
const functions = require('firebase-functions')

const nodemailer = require('./email')
const statusTemplate = require('./email/templates/status_change')
const newDeployTemplate = require('./email/templates/new_deploy')

exports.emailUserOnStatusChange = functions.database.ref('/vps/{id}').onUpdate(ev => {
    const oldData = ev.before.val()
    const nextData = ev.after.val()

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

exports.emailOnDeploy = functions.database.ref('/to-deploy/tasks/{id}').onCreate(event => {
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
