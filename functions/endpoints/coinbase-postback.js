var _ = require('lodash');

const updateBalance = require('./helpers/update-balance')
const nodemailer = require('../functions/email')
const cryptoTemplate = require('../functions/email/templates/unresolved-payment')

/**
 * @api {post} /coinbase-postback Coinbase postback
 *  Will need someone else to describe this endpoint.
 * @apiGroup Endpoints
 */
module.exports = (req, res) => {

    // Parse webhook payload and perform some actions based on success!
    let data = req.body.event.data;
    console.log('Crypto Charge event: ', data)

    if (typeof  _.findKey(data.timeline, {status: 'COMPLETED'}) !== 'undefined') {
    	console.log('Crypto Charge confirmed: ', data.code)

        
        updateBalance(data.metadata.userId, parseInt(data.metadata.chargeAmount) * 100, (err) => {
            if (err) {
                return res.status(400).send({
                    error: true,
                    message: 'Error updating balance. Contact support'
                })
            }
        });  

        return res.send().status(200);
    } else if (typeof  _.findKey(data.timeline, {status: 'UNRESOLVED'}) !== 'undefined') {
    	
        // Check payments blob for these cases
        if (typeof  _.findKey(data.timeline, {context: 'UNDERPAID'}) !== 'undefined' || typeof  _.findKey(data.timeline, {context: 'OVERPAID'}) !== 'undefined') {
            // Charge amount will be converted to cents before updating balance
            updateBalance(data.metadata.userId, parseInt(data.payments[0].value.local.amount) * 100, (err) => {
                if (err) {
                    return res.status(400).send({
                        error: true,
                        message: 'Error updating balance. Contact support'
                    })
                }
            });  

            return res.send().status(200);
        } else {
            // send email
            nodemailer.sendMail({
                from: 'notification@masterminer.tech',
                to: 'max@masterminer.tech',
                subject: `Unresolved Coinbase Payment`,
                html: cryptoTemplate(data)
            }, (err, info) => {
                if (err) {
                    console.log(err)
                }
            })
            return res.send().status(200);

        }
    }   else {
        return res.send().status(200);
    }
}