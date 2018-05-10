const admin = require('firebase-admin')
const async = require('async')

module.exports = (req, res, next) => {

    const obj = {
        months: 3,
        mnKey: 'cVvMMBhj44TRyCsA2UX3orLHT4B5zQJ8sviLz4Fgb9GkF2PpeHFH',
        mnTxid: 'a323cbe9727c239892168718b05ea97e45989f4d382fa2855ed0650865a8541a',
        mnName: 'mn' + Math.random(),
        mnIndex: '0',
        orderDate: Date.now(),
        paymentId: 'SOMERANDOMID',
        deployed: false,
        userId: req.query.uid,
        lock: false,
        lockDate: null
    }

    if (req.query.ind_mode) {
        const interval = setInterval(() => {
            admin.database().ref('/to-deploy').push(obj)
        }, 5000)

        setTimeout(() => clearInterval(interval), 60000)
    } else {
        const arr = []

        for (let i = 0 ; i < 50 ; i++) {
            arr.push(obj)
        }

        async.each(arr, (i, cb) => {
            admin.database().ref('/to-deploy').push(i).then(() => cb()).catch(err => cb(err))
        }, err => {
            if (err) {
                console.log(err)
                return res.status(500).send({
                    error: err,
                    mes: 'Error'
                })
            }

            return res.send('All good!')

        })
    }
}
