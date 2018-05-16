const firebase = require('firebase-functions')
const admin = require('firebase-admin')
var _ = require('lodash');

module.exports = (req, res) => {

    // Parse webhook payload and perform some actions based on success!
    let data = req.body.event.data;
    
    data.metadata.body = _.replace(data.metadata.body, /=>/g, ":")
    data.metadata = JSON.parse(data.metadata.body)

    if (typeof  _.findKey(data.timeline, {status: 'NEW'}) !== 'undefined') {
    	console.log('Charge created: ', data.code)
    } else if (typeof  _.findKey(data.timeline, {status: 'COMPLETED'}) !== 'undefined') {
    	console.log('Charge confirmed: ', data.code)
    	const months = data.metadata.months,
            email = data.metadata.email,
            mnKey = data.metadata.mnKey,
            mnTxid = data.metadata.mnTxid,
            mnName = data.metadata.mnName,
            mnIndex = data.metadata.mnIndex,
            userId =  data.metadata.userId

        admin.database().ref('/to-deploy').push({
            months,
            mnKey,
            mnTxid,
            mnName,
            mnIndex,
            lock: false,
            lockDate: null,
            orderDate: data.created_at,
            paymentId: data.checkout.id,
            deployed: false,
            userId
        })
    
    } else if (typeof  _.findKey(data.timeline, {status: 'UNRESOLVED'}) !== 'undefined') {
    	console.log('Charge failed: ', data.code)
    }
  
    return res.send().status(200);
}