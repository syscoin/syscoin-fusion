const admin = require('firebase-admin')
const rewardTemplate = require('../../functions/email/templates/pool-reward')
const nodemailer = require('../../functions/email')

/**
 * @api {post} /droplets/email-reward Fires email reward notification
 * @apiDescription Goes through API filter - Sends notification to user on new reward
 * @apiGroup Droplets Endpoints
 * 
 * @apiSuccessExample {json} Success
 *  {
 *      error: false
 *  }
 * 
 */
module.exports = (req, res, next) => {
    const clientIp = (req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress).split(",")[0]

    try {
        admin.database().ref('/vps')
            .orderByChild('ip')
            .equalTo(clientIp)
            .once('value', snapshot => {
                if (snapshot.hasChildren()) {
                    const data = snapshot.val()
                    const key = Object.keys(data)

                    admin.auth().getUser(data[key].userId)
                        .then(userRecord => {
                            return nodemailer.sendMail({
                                from: 'notification@masterminer.tech',
                                to: userRecord.email,
                                subject: `New MN reward`,
                                html: rewardTemplate()
                            }, (err, info) => {
                                if (err) {
                                    console.log(err)
                                    return res.status(500).json({err: true})
                                }

                                return res.json({error: false})
                            })
                        }).catch((e) => {
                            throw e
                        })
                }

            }).catch(() => res.status(500).send({
                error: true,
                message: 'Internal Server Error.'
            }))
    } catch(e) {
        return res.status(500).json({
            error: true,
            message: 'Something went wrong'
        })
    }
}
