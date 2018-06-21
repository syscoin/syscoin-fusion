const functions = require('firebase-functions')
const admin = require('firebase-admin')
const async = require('async')

const nodeMailer = require('../functions/email')
const templates = {
    user: require('../functions/email/templates/pooling_user'),
    review: require('../functions/email/templates/pooling_review')
}

module.exports = (req, res, next) => {
    const { tier, shares, comments } = req.body
    const email = req.user.email

    if (!(tier && shares && email)) {
        return res.status(400).send({
            error: true,
            message: 'Required param missing.'
        })
    }

    async.parallel([
        cb => nodeMailer.sendMail({
            from: 'notification@masterminer.tech',
            to: email,
            subject: `Welcome to Masterminer's pooling program`,
            html: templates.user()
        }, (err, info) => {
            if (err) {
                return cb(err)
            }

            return cb(null)
        }),
        cb => nodeMailer.sendMail({
            from: 'notification@masterminer.tech',
            to: functions.config().emails.pooling_reviewer,
            subject: `New Masternode Pool application from ${email}`,
            html: templates.review(email, tier, shares, comments)
        }, (err, info) => {
            if (err) {
                return cb(err)
            }

            return cb(null)
        })
    ], (err) => {
        if (err) {
            return res.status(500).send({
                error: true,
                message: 'Internal server error'
            })
        }

        return res.status(200).send({
            message: 'Successfuly applied'
        })
    })
}
