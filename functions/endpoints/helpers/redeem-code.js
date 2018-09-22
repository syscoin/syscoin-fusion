const firebase = require('firebase-functions')
const admin = require('firebase-admin')

module.exports = (obj, cb) => {
    const { email, code } =  obj

    try {
        admin.database().ref('/codes').orderByChild('code').equalTo(code)
                    .once('value', snap => {
                        const key = Object.keys(snap.val())[0]

                        if (key && snap.val()[key].email === email && snap.val()[key].redeemed === false) {
                            admin.database().ref('/codes/' + key).update({
                                redeemed: true
                            }).then(() => cb(null, {
                                months: snap.val()[key].months
                            })).catch(() => cb(true))
                        } else {
                            return cb(true)
                        }
                        
                    })
    } catch (err) {
        return cb(err)
    }
    
}
