const admin = require('firebase-admin')

/**
 * @api {post} /droplets/edit-status Edit MN status
 * @apiDescription Goes through API filter - Edits MN status shown in UI.
 * @apiGroup Droplets Endpoints
 * 
 * @apiParam {String} status New status 
 * @apiSuccessExample {json} Success
 *  {
 *      error: false,
 *      message: `Status updated to ${status}`
 *  }
 * 
 */
module.exports = (req, res, next) => {
    const clientIp = (req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress).split(",")[0]

    const newStatus = req.body.status

    admin.database().ref('/vps')
        .orderByChild('ip')
        .equalTo(clientIp)
        .once('value', snapshot => {
            if (snapshot.hasChildren()) {
                const vpsRef = '/vps/' + Object.keys(snapshot.val())[0]
                admin.database().ref(vpsRef).update({
                    status: newStatus
                }).then(() => res.send({
                    error: false,
                    message: `Status updated to "${newStatus}"`
                })).catch(() => res.status(500).send({
                    error: true,
                    message: 'Internal Server Error.'
                }))
            } else {
                res.status(404).send({
                    message: 'Not a masternode',
                    error: true
                })
            }
        }).catch(() => res.status(500).send({
            error: true,
            message: 'Internal Server Error.'
        }))
}
