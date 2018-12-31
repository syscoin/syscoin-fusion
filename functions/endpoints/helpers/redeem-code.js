const firebase = require('firebase-functions')
const admin = require('firebase-admin')

module.exports = (obj, cb) => {
    const { email, code } = obj

    admin.database().ref('/codes').orderByChild('code').equalTo(code)
        .once('value', snap => {
            let key

            try {
                key = Object.keys(snap.val())[0]
            } catch(err) {
                return cb(err)
            }

            if (key && snap.val()[key].email === email && snap.val()[key].redeemed === false) {
                admin.database().ref('/codes/' + key).update({
                    redeemed: true
                }).then(() => cb(null, {
                    chargeAmount: snap.val()[key].amount
                })).catch(() => cb(true))
            } else {
                return cb(true)
            }

        })

}
