const firebase = require('firebase-functions')
const admin = require('firebase-admin')
const async = require('async')

module.exports = (req, res, next) => {
    const activeImage = firebase.config().dropletconfig.imageid
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

                                console.log(returnData.imageId, activeImage)

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

                admin.database().ref('/to-deploy')
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
