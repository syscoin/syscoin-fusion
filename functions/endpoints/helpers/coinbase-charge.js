const functions = require('firebase-functions')
const axios = require('axios')

const coinbase_url = functions.config().coinbase.charges
const coinbase_key = functions.config().coinbase.key
const coinbase_ver = functions.config().coinbase.ver

module.exports = (data, cb) => {
    let chargeAmount = parseInt(data.months)

    switch(chargeAmount) {
        case 1:
            chargeAmount = 7.5
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

	axios.post(coinbase_url, {
		headers: {
			X-CC-Api-Key: coinbase_key,
			X-CC-Version: coinbaes_ver
		},
		data: {
			name: 'Masterminer subscription',
			description: 'Masternode hosting service',
			local_price: {
            	amount: chargeAmount,
             	currency: "USD"
            },
	        pricing_type: "fixed_price",
	        metadata: {
	        	data
         	}
         },
	})
	.then((res) => {
		return cb(null, res.body.data)
	})
	.catch((err) => {
		return cb(err)
    })
}
