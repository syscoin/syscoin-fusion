const firebase = require('firebase-functions')
const admin = require('firebase-admin')
const async = require('async')

/**
 * @api {get} /nodes Get user nodes
 * @apiDescription Needs firebase authentication - no params taken
 * @apiGroup Endpoints
 * 
 * @apiSuccessExample {json} Success
 * {
	"masternodes": [
		{
			"expiresOn": 1559678130103,
			"numberOfMonths": 12,
			"paymentId": "B4HMKMPV6RFR34UQ6",
			"purchaseDate": 1528142130103,
			"totalCharge": 180,
			"userId": "mkIYEF2gCERwj0bzwghW7Z0A7A72",
			"id": "-LEBMahKyDCv7Uhi8Lp9",
			"mnData": {
				"mnIndex": "0",
				"mnKey": "5KSSq3TWJvsdReVAS9fCfGFCHaTrK6RDJbCBGewUbgRwJ5WBsTB",
				"mnName": "mn3",
				"mnTxid": "2465b4a92612ddd853f658c37d8b192b658a54691bf4441ebdbafe80971b0bb3",
				"orderId": "-LEBMahKyDCv7Uhi8Lp9",
				"userId": "mkIYEF2gCERwj0bzwghW7Z0A7A72",
				"vpsId": "-LEBMahUdZ_kJCNdKUNP",
				"id": "-LEBMaiIS1oev0Serw0r"
			},
			"vpsInfo": {
				"configFile": "rpcuser=GanAtiOPENdsLaTeOtIBEhesUpespOSI\nrpcpassword=toNTImpaNDYBrustoGrUTomEndrayAtW\nrpcallowip=127.0.0.1\nrpcbind=127.0.0.1\n#\nlisten=1\nserver=1\ndaemon=1\nmaxconnections=24\nport=8369\nmasternode=1\nmasternodeprivkey=5KSSq3TWJvsdReVAS9fCfGFCHaTrK6RDJbCBGewUbgRwJ5WBsTB\nexternalip=138.68.230.49\n",
				"imageId": "35666737",
				"ip": "138.68.230.49",
				"lastUpdate": 1532559841662,
				"lock": true,
				"orderId": "-LEBMahKyDCv7Uhi8Lp9",
				"status": "Not capable masternode: Masternode not in masternode list",
				"uptime": 0,
				"userId": "mkIYEF2gCERwj0bzwghW7Z0A7A72",
                "vpsid": 96358319,
                "shouldUpdate": true, // Only if VPS is upgradable
				"id": "-LEBMahUdZ_kJCNdKUNP"
			}
		}
	],
	"isDeploying": false
}
 */
module.exports = (req, res, next) => {
    const activeImage = firebase.config().images.sys
    admin.database().ref('/orders')
        .orderByChild('userId')
        .equalTo(req.user.uid)
        .once('value', snapshot => {
            if (!snapshot.hasChildren) {
                return res.send([])
            }
            
            const data = []
            const finalData = {
                masternodes: []
            }
            const snap = snapshot.val()

            for (let key in snap) {
                let newObj = snap[key]
                newObj.id = key
                data.push(newObj)
            }

            async.each(data, (i, cb) => {
                async.parallel([
                    cb => {
                        admin.database().ref('/mn-data')
                            .orderByChild('orderId')
                            .equalTo(i.id)
                            .once('value', snapshot => {
                                if (!snapshot.hasChildren()) {
                                    return cb(true)
                                }
                                const snap = snapshot.val()
                                let objectKey = Object.keys(snap)[0]
                                const returnData = snap[objectKey]

                                returnData.id = objectKey

                                cb(null, returnData)
                            })
                            .catch(err => cb(err))
                    },
                    cb => {
                        admin.database().ref('/vps')
                            .orderByChild('orderId')
                            .equalTo(i.id)
                            .once('value', snapshot => {
                                if (!snapshot.hasChildren()) {
                                    return cb(true)
                                }
                                const snap = snapshot.val()
                                let objectKey = Object.keys(snap)[0]
                                const returnData = snap[objectKey]

                                returnData.id = objectKey

                                if (returnData.imageId !== activeImage) {
                                    returnData.shouldUpdate = true
                                }

                                cb(null, returnData)
                            })
                            .catch(err => cb(err))
                    }
                ], (err, data) => {
                    if (err) {
                        i.error = true
                        finalData.masternodes.push(i)
                        return cb(null, err)
                    }

                    const newObj = i

                    i.mnData = data[0]
                    i.vpsInfo = data[1]

                    finalData.masternodes.push(i)

                    return cb(null)
                })
            }, (err) => {
                if (err) {
                    return res.status(500).send({error: 'Something went wrong. Try reloading the page.'})
                }

                admin.database().ref('/to-deploy/tasks')
                    .orderByChild('userId')
                    .equalTo(req.user.uid)
                    .once('value', snapshot => {
                        if (!snapshot.hasChildren()) {
                            finalData.isDeploying = false
                            return res.status(200).send(finalData)
                        }

                        const data = snapshot.val()
                        const keys = Object.keys(data)

                        finalData.isDeploying = Boolean(keys.find(i => !data[i].deployed))

                        return res.status(200).send(finalData)
                    }).catch(err => {
                        if (err) {
                            console.log(err)
                        }
                        return res.status(500).send({
                            error: true
                        })
                    })
            })
        })
}
