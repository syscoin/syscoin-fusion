const firebase = require('firebase-functions')
const admin = require('firebase-admin')
const async = require('async')

module.exports = (req, res, next) => {
    async.map([1, 2, 3], (tier, cb) => {
        admin.database().ref('/pooling/tier' + tier)
            .once('value', snapshot => {
                if (!snapshot.hasChildren()) {
                    return cb(null, {
                        activeMasternodes: 0,
                        nextMnProgress: 0,
                        column: [
                            'Tier ' + tier,
                            0
                        ],
                        tier
                    })
                }
                const val = snapshot.val()
                const keys = Object.keys(val)

                let totalSys = 0

                keys.forEach(i => {
                    totalSys += val[i].sysAmount
                })

                const toSend = {
                    activeMasternodes: (Math.ceil(totalSys / 100000) || 1) - 1,
                    nextMnProgress: parseFloat(((totalSys || 0) % 100000).toFixed(2)),
                    column: [
                        'Tier ' + tier,
                        parseFloat(((totalSys || 0) % 100000).toFixed(2))
                    ],
                    tier
                }

                if (req.user) {
                    return admin.database().ref('/pooling/tier' + tier)
                        .orderByChild('email')
                        .equalTo(req.user.email)
                        .once('value', snap => {
                            if (snap.hasChildren()) {
                                const val = snap.val()
                                const key = Object.keys(val)[0]
                                toSend.userData = val[key]

                                return cb(null, toSend)
                            } else {
                                return cb(null, toSend)
                            }
                        })
                } else {
                    return cb(null, toSend)
                }
            })
    }, (err, data) => {
        if (err) {
            return res.status(500).send({
                error: true,
                message: 'Internal server error.'
            })
        }

        res.status(200).send(data)
    })
}
