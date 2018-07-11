const admin = require('firebase-admin')

module.exports.checkIpWhitelist = (req, res, next) => {
    const clientIp = (req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress).split(",")[0]

        admin.database().ref('/global/ipWhiteList').once('value', snapshot => {
            const ips = snapshot.val()
    
            if (ips) {
                return ips.indexOf(clientIp) !== -1 ? next() : res.status(403).send({
                    error: true,
                    message: 'Forbidden'
                })
            } else {
                return res.status(403).send({
                    error: true,
                    message: 'Forbidden'
                })
            }
    
        }).catch(() => res.sendStatus(500))
}