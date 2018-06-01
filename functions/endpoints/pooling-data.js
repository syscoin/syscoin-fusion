const firebase = require('firebase-functions')
const admin = require('firebase-admin')
const async = require('async')

module.exports = (req, res, next) => {
    return admin.database().ref('/pooling')
        .once('value', snapshot => {
            const val = snapshot.val()
            const keys = Object.keys(val)

            let totalSys = 0

            keys.forEach(i => {
                totalSys += val[i].sysAmount
            })
            
            const toSend = {
                columns: Math.ceil(totalSys / 100000) || 1,
                nextMnProgress: parseFloat(((totalSys || 0) % 100000).toFixed(2))
            }

            if (req.user) {
                return admin.database().ref('/pooling')
                    .orderByChild('email')
                    .equalTo(req.user.email)
                    .once('value', snap => {
                        if (snap.hasChildren()) {
                            const val = snap.val()
                            const key = Object.keys(val)[0]
                            toSend.userData = val[key]

                            return res.status(200).send(toSend)
                        } else {
                            return res.status(200).send(toSend)
                        }
                    })
            } else {
                return res.status(200).send(toSend)
            }
        })
}
