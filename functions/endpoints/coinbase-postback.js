const firebase = require('firebase-functions')
const admin = require('firebase-admin')

module.exports = (req, res) => {
    console.log(JSON.stringify(req.body.event.data, null, 4));

    // Parse webhook payload and perform some actions based on success!
    const data = req.body.event.data;

    if (data.type === 'charge:created') {
    	console.log('Charge created: ', data.id)
    } else if (data.type === 'charge:confirmed') {
    	console.log('Charge confirmed: ', data.id)
    	const months,
            email = data.metadata.email
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

    } else if (data.type === 'charge:failed') {
    	console.log('Charge failed: ', data.id)
    }
  
    return res.status(200);
}