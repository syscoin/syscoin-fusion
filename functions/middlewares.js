const admin = require('firebase-admin')
const updateBalance = require('./endpoints/helpers/update-balance')
const updateLastUpdated = require('./endpoints/helpers/edit-last-charge')
const deleteMn = require('./functions/expired-mn-watch/delete-mn')
const deleteAwsMn = require('./functions/helpers/aws/delete-node')

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
                const key = Object.keys(snapshot.val())[0]
                const data = snapshot.val()[key]

                req.mnUserId = data.userId
                req.orderId = data.orderId
                req.mnDataId = data.mnDataId
                req.keysId = data.keysId
                req.vpsId = key

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

module.exports.chargeIfNeeded = (req, res, next) => {
    const nextChargeDate = req.orderData.chargeLastMadeAt + (24 * 60 * 60 * 1000)

    // Check if should charge based on last charge date
    if (nextChargeDate > Date.now()) {
        return next()
    } else {
        admin.database().ref('/prices/' + req.mnData.nodeType)
            .once('value', snapshot => {
                const amount = snapshot.val()
                const dailyAmount = parseFloat(amount) / 30 // dividing by 30 so we can get the daily rate

                updateBalance(req.orderData.userId, dailyAmount * -1,
                    async (err) => {
                        if (err) {
                            try {

                                if (req.vpsData.vpsOrigin === 'aws') {
                                    await deleteAwsMn(req.vpsData.vpsId, req.vpsData.allocationId)
                                } else {
                                    await deleteMn(req.vpsData.orderId)
                                }
                                
                            } catch(err) {
                                return res.sendStatus(500)
                            }

                            return res.sendStatus(403)
                        }

                        updateLastUpdated(req.vpsData.orderId, (err) => {
                            if (err) {
                                console.log("Error in update mn charge last updated: ", err)
                                return res.sendStatus(500)
                            }

                            return next()
                        })
                    })
            }).catch(() => res.sendStatus(500))
    }
}

module.exports.gatherData = (req, res, next) => {
    Promise.all([
        admin.database().ref('/vps/' + req.vpsId).once('value'),
        admin.database().ref('/mn-data/' + req.mnDataId).once('value'),
        admin.database().ref('/keys/' + req.keysId).once('value'),
        admin.database().ref('/orders/' + req.orderId).once('value')
    ]).then(values => {
        req.vpsData = values[0].val()
        req.mnData = values[1].val()
        req.keysData = values[2].val()
        req.orderData = values[3].val()

        next()
    }).catch(err => res.status(500).send({
        error: true,
        message: 'Internal server error.'
    }))
}
