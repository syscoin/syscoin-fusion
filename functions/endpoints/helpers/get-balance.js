const admin = require('firebase-admin')

module.exports = (uid, cb) => {
    var readBalance = admin.database().ref('balance/' + uid);
    readBalance.once('value', snapshot => {
        let balance = snapshot.val()

        if (typeof balance !== 'number') {
            return cb('NO_BALANCE_FOUND')
        }

        return cb(null, balance);
    });
}
