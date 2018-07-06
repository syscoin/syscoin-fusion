const admin = require('firebase-admin')
const checkIpWhitelist = require('../helpers/check-whitelist-ip')

module.exports = (req, res, next) => {
    const clientIp = (req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress).split(",")[0]

    const newStatus = req.body.status

    return res.send(clientIp)

    admin.database().ref('/vps/' + clientIp).update({
        status: newStatus
    }).then(() => res.sendStatus(200)).catch(() => res.sendStatus(500))
}
