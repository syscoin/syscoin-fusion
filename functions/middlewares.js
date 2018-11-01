const admin = require('firebase-admin')

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
                       
                return next(data.orderId)
            } else {
                return res.status(403).send({
                    error: true,
                    message: 'Forbidden'
                })
            }
    
        }).catch(() => res.sendStatus(500))
}

module.exports.getOrderData = (req, res, next) => {
    admin.database().ref('/mndata')
    .orderByChild('orderId')
    .equalTo(req.orderId)
    .once('value', snapshot => {
    if (snapshot.hasChildren()) {
        const key = Object.keys(snapshot.val())[0]
        const data = snapshot.val()[key]
               
        return next()
    } else {
        return res.status(403).send({
            error: true,
            message: 'Forbidden'
        })
    }

}).catch(() => res.sendStatus(500))
}