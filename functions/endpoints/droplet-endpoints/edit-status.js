const admin = require('firebase-admin')

/**
 * @api {post} /droplets/edit-status Edit MN status
 * @apiDescription Goes through API filter - Edits MN status shown in UI.
 * @apiGroup Droplets Endpoints
 *
 * @apiParam {String} status New status
 * @apiParam {Object} info getinfo output
 * @apiSuccessExample {json} Success
 *  {
 *      error: false,
 *      message: `Status updated to ${status}`
 *  }
 *
 */
module.exports = (req, res, next) => {
    const { status, info } = req.body

    const toUpdate = {
        status
    }

    if (info) {
        toUpdate.info = info
    }

    admin.database().ref('/vps/' + req.orderData.vpsId).update(toUpdate)
    .then(() => res.send({
        error: false,
        message: `Status updated to "${status}"`
    })).catch(() => res.status(500).send({
        error: true,
        message: 'Internal Server Error.'
    }))
}
