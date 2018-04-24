const firebase = require('firebase-functions')
const admin = require('firebase-admin')
const async = require('async')

module.exports = (req, res, next) => {
    admin.database().ref('/orders')
        .orderByChild('userId')
        .equalTo(req.user.uid)
        .once('value', snapshot => {
            const data = []
            const finalData = []
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
                                const snap = snapshot.val()
                                let objectKey = Object.keys(snap)[0]
                                const returnData = snap[objectKey]

                                returnData.id = objectKey

                                cb(null, returnData)
                            })
                            .catch(err => cb(err))
                    }
                ], (err, data) => {
                    if (err) {
                        return cb(err)
                    }

                    const newObj = i

                    i.mnData = data[0]
                    i.vpsInfo = data[1]

                    finalData.push(i)

                    return cb(null)
                })
            }, (err) => {
                if (err) {
                    return res.status(500).send({error: 'Something went wrong.'})
                }


                return res.status(200).send(finalData)
            })
        })
}
