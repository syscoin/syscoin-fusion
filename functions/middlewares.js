const admin = require('firebase-admin')
const functions = require('firebase-functions')
const moment = require('moment')

const updateBalance = require('./endpoints/helpers/update-balance')
const updateLastUpdated = require('./endpoints/helpers/edit-last-charge')
const deleteMn = require('./functions/expired-mn-watch/delete-mn')
const deleteAwsMn = require('./functions/helpers/aws/delete-node')
const deleteLogs = require('./functions/helpers/delete-logs')
const getNodePrice = require('./endpoints/helpers/get-node-price')
const upgradeMn = require('./functions/helpers/upgrade-mn')
const saveVpsStatus = require('./functions/helpers/save-vps-status')

module.exports.checkIpWhitelist = (req, res, next) => {
    const clientIp = (req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress).split(",")[0]

    admin.database().ref('/vps')
        .orderByChild('ip')
        .equalTo(clientIp.trim())
        .once('value', snapshot => {
            if (snapshot.hasChildren()) {
                const key = Object.keys(snapshot.val())[0]
                const data = snapshot.val()[key]

                req.mnUserId = data.userId
                req.orderId = data.orderId
                req.mnDataId = data.mnDataId
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

module.exports.chargeIfNeeded = async (req, res, next) => {
    const nextChargeDate = req.orderData.chargeLastMadeAt + (24 * 60 * 60 * 1000)

    // Check if should charge based on last charge date
    if (nextChargeDate > Date.now()) {
        return next()
    }

    const amount = await getNodePrice(req.mnData.nodeType)
    let dailyAmount = parseInt(amount) / 30 // dividing by 30 so we can get the daily rate

    if (req.vpsData.vpsOrigin === 'do') {
        dailyAmount = 1500 / 30
    }

    updateBalance(req.orderData.userId, dailyAmount * -1,
        async (err) => {
            if (err) {
                try {

                    if (req.vpsData.vpsOrigin === 'aws') {
                        await deleteAwsMn(req.vpsData.vpsid, req.vpsData.allocationId)
                    } else {
                        await deleteMn(req.vpsData.orderId)
                    }

                    await deleteLogs({
                        vpsId: req.vpsId,
                        mnDataId: req.mnDataId,
                        orderId: req.orderId
                    })

                } catch (err) {
                    return res.sendStatus(500)
                }

                return res.sendStatus(403)
            }

            updateLastUpdated(req.vpsData.orderId, (err) => {
                if (err) {
                    return res.sendStatus(500)
                }

                return next()
            })
        })
}

module.exports.gatherData = (req, res, next) => {
    Promise.all([
        admin.database().ref('/vps/' + req.vpsId).once('value'),
        admin.database().ref('/mn-data/' + req.mnDataId).once('value'),
        admin.database().ref('/orders/' + req.orderId).once('value')
    ]).then(values => {
        req.vpsData = values[0].val()
        req.mnData = values[1].val()
        req.orderData = values[2].val()

        next()
    }).catch(err => res.status(500).send({
        error: true,
        message: 'Internal server error.'
    }))
}

module.exports.shouldUpgrade = async (req, res, next) => {
    const nodeType = req.mnData.nodeType
    const image = functions.config().images[nodeType]
    const maxDate = functions.config().images[nodeType + '_max_date']

    if (req.vpsData.vpsOrigin === 'do') {
        return next()
    }

    if (moment() > moment(maxDate) && image !== req.vpsData.imageId) {

        try {
            await upgradeMn({
                dropletId: req.vpsData.vpsid
            })
        } catch(err) {
            return res.status(500).send({
                error: true,
                message: 'Error while trying to upgrade'
            })
        }

        return saveVpsStatus(req.vpsId, {
            status: 'Node is updating.',
            imageId: image
        }, () => {
            return res.status(202).send({
                error: false,
                message: 'Node is updating.'
            })
        })
        
    }

    return next()
}
