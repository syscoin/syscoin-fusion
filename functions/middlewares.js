const admin = require('firebase-admin')
const updateBalance = require('./endpoints/helpers/update-balance')
const updateLastUpdated = require('./endpoints/helpers/edit-last-charge')

module.exports.checkIpWhitelist = (req, res, next) => {
    const clientIp = (req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress).split(",")[0]

    admin.database().ref('/vps')
        .orderByChild('ip')
        .equalTo(clientIp)
        .once('value', snapshot => {
            if (snapshot.hasChildren()) {
                return next()
            } else {
                return res.status(403).send({
                    error: true,
                    message: 'Forbidden'
                })
            }

        }).catch(() => res.sendStatus(500))
}

module.exports.checkIpForUpdate = (req, res, next) => {
     const clientIp = (req.headers['x-forwarded-for'] || 
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress).split(",")[0]
        admin.database().ref('/vps')
            .orderByChild('ip')
            .equalTo(clientIp)
            .once('value', snapshot => {
            if (snapshot.hasChildren()) {
                const key = Object.keys(snapshot.val())[0]
                const data = snapshot.val()[key]

                req.mnUserId = data.userId;
                req.orderId = data.orderId;

                return next()
            } else {
                return res.status(403).send({
                    error: true,
                    message: 'Forbidden'
                })
            }
        }).catch(() => res.sendStatus(500))
}

module.exports.getMNType = (req, res, next) => {
    admin.database().ref('/mn-data')
        .orderByChild('orderId')
        .equalTo(req.orderId)
        .once('value', snapshot => {
            if (snapshot.hasChildren()) {
                const key = Object.keys(snapshot.val())[0]
                const data = snapshot.val()[key]

                req.mnType = data.nodeType;
                req.chargeLastMadeAt = data.chargeLastMadeAt

                return next()
            } else {
                return res.status(403).send({
                    error: true,
                    message: 'Forbidden'
                })
            }
        }).catch(() => res.sendStatus(500))
}

module.exports.getOrderData = (req, res, next) => {
    const nextChargeDate = req.chargeLastMadeAt + (24 * 60 * 60)

    // Check if should charge based on last charge date
    if (nextChargeDate > Date.now()) {
        return next()
    } else {
        admin.database().ref('/prices/' + req.mnType)
            .once('value', snapshot => {
                const amount = snapshot.val()

                updateBalance(req.mnUserId, parseFloat(amount) * -1,
                    (err) => {
                        if (err) {
                            console.log("Error in update balance: ", err)
                            // res.sendStatus(500)
                        }

                        updateLastUpdated(req.orderId, (err) => {
                            if (err) {
                                console.log("Error in update mn charge last updated: ", err)
                                // res.sendStatus(500)
                            }
                        })
                    })

                return next()
            }).catch(() => res.sendStatus(500))
    }
}