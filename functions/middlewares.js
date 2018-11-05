const admin = require('firebase-admin')
const updateBalance = require('./endpoints/helpers/update-balance')

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
     const clientIp = '165.227.12.112' // (req.headers['x-forwarded-for'] ||
    //     req.connection.remoteAddress ||
    //     req.socket.remoteAddress ||
    //     req.connection.socket.remoteAddress).split(",")[0]
        admin.database().ref('/vps')
            .orderByChild('ip')
            .equalTo(clientIp)
            .once('value', snapshot => {
            if (snapshot.hasChildren()) {
                const key = Object.keys(snapshot.val())[0]
                const data = snapshot.val()[key]
                
                req.body.mnUserId = data.userId;
                // Need to replace with actual mntype
                //  req.body.mnType = data.mnType
                req.body.mnType = "sys";

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
    admin.database().ref('/prices/'+req.body.mnType)
    .once('value', snapshot => {
        const amount = snapshot.val()
        
        updateBalance(req.body.mnUserId, parseFloat(amount)*-1,
            (err) => {
            if (err) {
                console.log("Error in update balance")
                return res.sendStatus(500)
            }
        })

        return next() 
    }).catch(() => res.sendStatus(500))
}