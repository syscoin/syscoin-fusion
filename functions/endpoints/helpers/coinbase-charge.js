const functions = require('firebase-functions')
const axios = require('axios')

const coinbase_url = functions.config().coinbase.charges
const coinbase_key = functions.config().coinbase.key
const coinbase_ver = functions.config().coinbase.ver

module.exports = (data, cb) => {
    let chargeAmount = parseInt(data.months)
    const meta = data

    switch(chargeAmount) {
        case 1:
            chargeAmount = 7.50
            break
        case 3:
            chargeAmount = 45
            break
        case 6:
            chargeAmount = 90
            break
        case 9:
            chargeAmount = 135
            break
        case 12:
            chargeAmount = 180
            break
        default:
            return cb('Invalid amount')
    }

	axios({url: coinbase_url,
        method: 'POST',
		headers: {
			'X-CC-Api-Key': coinbase_key,
			'X-CC-Version': coinbase_ver,
            'Content-type': 'application/json'
		},
		data: {
			name: 'Masterminer subscription',
			description: 'Masternode hosting service',
			local_price: {
            	amount: chargeAmount,
             	currency: "USD"
            },
	        pricing_type: "fixed_price",
	        metadata: meta
        },
	})
	.then((res) => {
        let data = {};
        const body = res.data.data

        switch (meta.method) {
            case 'btc':
                data = {
                    address : body.addresses.bitcoin,
                    value : body.pricing.bitcoin.amount,
                    currency : body.pricing.bitcoin.currency,
                    expires_at : body.expires_at
                };
                break;
            case 'bch': 
                data = {
                    address : body.addresses.bitcoincash,
                    value : body.pricing.bitcoincash.amount,
                    currency : body.pricing.bitcoincash.currency,
                    expires_at : body.expires_at
                };
                break;
            case 'eth':   
                data = {
                    address : body.addresses.ethereum,
                    value : body.pricing.ethereum.amount,
                    currency : body.pricing.ethereum.currency,
                    expires_at : body.expires_at
                };
                break;
            case 'ltc':   
                data = {
                    address : body.addresses.litecoin,
                    value : body.pricing.litecoin.amount,
                    currency : body.pricing.litecoin.currency,
                    expires_at : body.expires_at
                };
                break;
            default:
        }

		return cb(null, data)
	})
	.catch((err) => {
        console.log(err)
		return cb(err)
    })
}
