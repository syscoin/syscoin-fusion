const admin = require('firebase-admin')

module.exports = (vps, cb) => {
    admin.database().ref('/keys').once('value', snapshot => {
        const snap = snapshot.val()
        const keys = Object.keys(snap)
        const results = []

        keys.forEach(i => {
            const mnKeys = snap[i]
            const toAppend = vps.find(x => {
                return x.orderId === snap[i].orderId
            })

            toAppend.mnKeys = mnKeys

            results.push(toAppend)
        })

        return cb(null, results)
    })
}
