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
            email = req.body.email
            mnKey = req.body.key,
            mnTxid = req.body.txid,
            mnName = req.body.name,
            mnIndex = req.body.index

    	if(data.name === 'Masterminer - 3 month') {
    		months = 3;
    	}
    } else if (data.type === 'charge:failed') {
    	console.log('Charge failed: ', data.id)
    }
  
    return res.status(200);
}