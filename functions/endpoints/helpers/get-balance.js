const admin = require('firebase-admin')

module.exports = (uid, cb) => {
    var readBalance = admin.database().ref('balance/' + uid);
    try {
        readBalance.once('value', (snapshot) => {
            if (snapshot.hasChildren()) {
                return cb(null, snapshot.val()); 
            }
        });
    } catch (e) {
        return cb(null, 0);
    }
}
