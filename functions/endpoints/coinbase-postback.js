const firebase = require('firebase-functions')
const admin = require('firebase-admin')
var _ = require('lodash');

const updateBalance = require('./helpers/update-balance')

/**
 * @api {post} /coinbase-postback Coinbase postback
 *  Will need someone else to describe this endpoint.
 * @apiGroup Endpoints
 */
module.exports = (req, res) => {

    // Parse webhook payload and perform some actions based on success!
    let data = req.body.event.data;

    if (typeof  _.findKey(data.timeline, {status: 'COMPLETED'}) !== 'undefined') {
    	console.log('Charge confirmed: ', data.code)

        
        updateBalance(data.metadata.uid, data.metadata.chargeAmount, (err) => {
            if (err) {
                return res.status(400).send({
                    error: true,
                    message: 'Error updating balance. Contact support'
                })
            }
        });  

        return res.send().status(200);
    } else if (typeof  _.findKey(data.timeline, {status: 'UNRESOLVED'}) !== 'undefined') {
    	console.log('Charge Unresolved: ', data.code)

        // Check payments blob for these cases
        if (typeof  _.findKey(data.timeline, {context: 'UNDERPAID'}) !== 'undefined' || typeof  _.findKey(data.timeline, {context: 'OVERPAID'}) !== 'undefined') {
            updateBalance(data.metadata.uid, data.pricing.local.amount, (err) => {
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
        }
    }   else {
        return res.send().status(200);
    }
}