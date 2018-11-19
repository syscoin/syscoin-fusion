const admin = require('firebase-admin')

module.exports = (uid, cb) => {
    var readBalance = admin.database().ref('balance/' + uid);
    readBalance.once('value', snapshot => {
        let balance

        try {
            balanace = snapshot.val()
        } catch (err) {
            return cb(new Error('NO_BALANCE_FOUND'))
        }

        return cb(null, balance);
    });
}
