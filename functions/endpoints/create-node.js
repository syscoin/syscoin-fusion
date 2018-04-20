const firebase = require('firebase-functions')
const admin = require('firebase-admin')
const async = require('async')

const makeCharge = require('./helpers/make-charge')
const createDroplet = require('./helpers/create-droplet')
const getDropletIp = require('./helpers/get-droplet-ip')

module.exports = (req, res, next) => {
    // Handles new Masternode orders
    try {
        const token = req.body.token.token,
            months = req.body.months,
            email = req.body.email;
            mnKey = req.body.key,
            mnTxid = req.body.txid,
            mnName = req.body.name,
            mnIndex = req.body.index

        if (token.error) {
            // If the token has an error, return 400
            return res.status(400).send({ error: token.error.message })
        }
        
        // Start payment/deployment process
        async.waterfall([
            (cb) => {
                console.log('chage start')
                // Charges to the client
                makeCharge({
                    email,
                    months,
                    tokenId: token.id
                }, (err, charge) => {
                    if (err) {
                        return cb(err)
                    }

                    console.log('chage complete')

                    return cb(null, charge)
                })
            },
            (charge, cb) => {
                // Creates droplet and generate keys
                console.log('droplet start')
                createDroplet((err, data) => {
                    if (err) {
                        return cb(err)
                    }

                    console.log('droplet complete')
                    console.log('ip start')

                    // Gets IP address of newly created droplet
                    setTimeout(() => {
                        getDropletIp(data.droplet.droplet.id, (err, ip) => {
                            if (err) {
                                return cb(err)
                            }
    
                            data.ip = ip
    
                            console.log('ip complete')
                            console.log(ip)
    
                            /*
                                data has the following structure:
                                    droplet - object - general droplet info recently created
                                    keys - object - private/public and encrypted PEM keys
                                    ip - string - Droplet IP address
                            */
                            return cb(null, charge, data)
                        })
                    }, 15000)
                    
                })
            },
            (charge, dropletData, cb) => {
                // Saves order info
                console.log('order start')
                admin.database().ref('/orders').push({
                    userId: req.user.uid,
                    expiresOn: new Date().setMonth(new Date().getMonth() + parseInt(months)),
                    purchaseDate: new Date(),
                    numberOfMonths: parseInt(months),
                    totalCharge: parseInt(months) * 15,
                    paymentId: charge.id
                }).then((order) => {
                    console.log('order complete')
                    return cb(null, charge, dropletData, order)
                }).catch((err) => {
                    console.log('order error')
                    return cb(err)
                })
            },
            (charge, dropletData, order, cb) => {
                // Saves dropletInfo
                console.log('vps start')
                admin.database().ref('/vps').push({
                    userId: req.user.uid,
                    orderId: order.key,
                    status: 'offline',
                    lastUpdate: new Date(),
                    uptime: 0,
                    vpsid: dropletData.droplet.droplet.id,
                    ip: dropletData.ip
                }).then((vps) => {
                    console.log('vps complete')
                    return cb(null, charge, dropletData, order, vps)
                }).catch((err) => cb(err))
            },
            (charge, dropletData, order, vps, cb) => {
                // Saves keys info
                console.log('key start')
                admin.database().ref('/keys').push({
                    sshkey: dropletData.keys.keys.priv.enc,
                    typeLength: dropletData.keys.keys.priv.typeLength,
                    vpsId: vps.key,
                    userId: req.user.uid,
                    orderId: order.key
                }).then((key) => {
                    console.log('key complete')
                    return cb(null, charge, dropletData, order, vps, key)
                }).catch(err => cb(err))
            },
            (charge, dropletData, order, vps, key, cb) => {
                // Saves mn data
                console.log('mndata start')
                admin.database().ref('/mn-data').push({
                    vpsId: vps.key,
                    userId: req.user.uid,
                    orderId: order.key,
                    mnKey,
                    mnTxid,
                    mnName,
                    mnIndex
                }).then((mndata) => {
                    console.log('mndata complete')
                    return cb(null, charge, dropletData, order, vps, key, mndata)
                }).catch(err => cb(err))
            }
        ], (err, charge, dropletData, order, vps, key, mndata) => {
            if (err) {
                console.log(err.response)
                return res.status(400).send('Something went wrong.')
            }

            console.log('SUCCESS')

            return res.send({
                message: 'Payment completed',
                expiresOn: new Date().setMonth(new Date().getMonth() + parseInt(months)),
                purchaseDate: Date.now(),
                paymentId: charge.id
            })
        })
    } catch (err) {
        return next(err)
    }

}
