const admin = require('firebase-admin')

module.exports = (uid, cb) => {
    var readBalance = admin.database().ref('/balance/' + uid);
    readBalance.once('value', snapshot => {
        let balance = snapshot.val()

        if (typeof balance !== 'number') {
            return admin.database().ref('/balance/' + uid).set(0)
                .then(() => cb(null, 0))
                .catch(err => cb(err))
        }

        return cb(null, balance);
    });
}
