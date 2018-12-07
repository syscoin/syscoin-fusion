const mailer = require('../functions/email')

/**
 * @api {post} /support-email Support email 
 * @apiDescription Needs firebase authentication
 * @apiGroup Endpoints
 * 
 * @apiParam {string} body Email body text.
 * @apiSuccessExample {json} Success
 * {"message": "Success", error: false}
 */
module.exports = (req, res) => {
    const body = req.body.body || ''
    const from = req.user.email

    mailer.sendMail({
        from,
        to: 'max@masterminer.tech',
        subject: 'New support message from ' + from,
        html: `
<div>
    ${body}
</div>
        `
    }, err => {
        if (err) {
            return res.status(400).send({
                error: true,
                message: 'Invalid body or sender'
            })
        }

        res.send({
            error: false,
            message: 'Success'
        })
    })
}
