const firebase = require('firebase-functions')
const admin = require('firebase-admin')
var _ = require('lodash');

const updateExpiry = require('./helpers/update-expiry')

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

        if (data.metadata.renew) {
            const payload = data.metadata
            payload.paymentMethod = payload.method

            updateExpiry(payload, (err, data) => {
                if (err) {
                    return res.status(500).send({
                        error: true,
                        message: 'Error'
                    })    
                }

                return res.status(200).send({
                    message: 'Success'
                })
            })
        } else {
        	const months = data.metadata.months,
                email = data.metadata.email,
                mnKey = data.metadata.mnKey,
                mnTxid = data.metadata.mnTxid,
                mnName = data.metadata.mnName,
                mnIndex = data.metadata.mnIndex,
                userId =  data.metadata.userId,
                paymentMethod = data.metadata.method,
                nodeType = req.body.nodeType || 'sys'

            admin.database().ref('/to-deploy/tasks').push({
                months,
                mnKey,
                mnTxid,
                mnName,
                mnIndex,
                paymentMethod,
                lock: false,
                lockDate: null,
                orderDate: data.created_at,
                paymentId: data.code,
                deployed: false,
                userId,
                nodeType
            })
            return res.send().status(200);
        }
        
    } 
}