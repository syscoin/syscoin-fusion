const firebase = require('firebase-functions')
const admin = require('firebase-admin')

const makeCharge = require('./helpers/make-charge')

module.exports = (req, res, next) => {
    const { orderId, tokenId, months, email } = req.body
    const obj = {
        email,
        months,
        tokenId
    }

    return admin.database().ref('/orders/' + orderId)
                    .once('value', snapshot => {
                        const snaps = snapshot.val()

                        if (snaps.userId === req.user.uid) {
                            makeCharge(obj, (err, data) => {
                                if (err) {
                                    return res.status(500).send({
                                        error: true,
                                        message: 'Internal server error.'
                                    })
                                }

                                const expireDate = new Date(snaps.expiresOn)
                        
                                admin.database().ref('/orders/' + orderId).update({
                                    expiresOn: expireDate.setMonth(expireDate.getMonth() + parseInt(months)),
                                    numberOfMonths: parseInt(snaps.numberOfMonths) + parseInt(months)
                                }).then(() => {
                                    return res.status(200).send({
                                        message: 'Success'
                                    })
                                }).catch(err => {
                                    console.log(err)
                                    return res.status(500).send({
                                        error: true,
                                        message: 'Success'
                                    })
                                })
                            })
                        } else {
                            return res.status(403).send({
                                error: true,
                                message: 'You are not authorized to do that'
                            })
                        }
                    })
}
