const firebase = require('firebase-functions')
const admin = require('firebase-admin')
const async = require('async')

const nodeMailer = require('../functions/email')
const templates = {
    user: require('../functions/email/templates/pooling_user'),
    review: require('../functions/email/templates/pooling_review')
}

module.exports = (req, res, next) => {
    const { tier, shares } = req.body
    const email = req.user.email

    async.parallel([
        cb => nodeMailer.sendMail({
            from: 'notification@masterminer.tech',
            to: email,
            subject: `Information about Masternode Pooling.`,
            html: templates.user()
        }, (err, info) => {
            if (err) {
                return cb(err)
            }

            return cb(null)
        }),
        cb => nodeMailer.sendMail({
            from: 'notification@masterminer.tech',
            to: process.env.emails.pooling_review,
            subject: `Information about Masternode Pooling.`,
            html: templates.user()
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
