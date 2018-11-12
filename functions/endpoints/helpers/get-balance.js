const admin = require('firebase-admin')

module.exports = (uid, cb) => {
    var readBalance = admin.database().ref('balance/' + uid);

    readBalance.once('value', (snapshot) => {
        if (snapshot.hasChildren()) {
            return cb(snapshot.val()); 
        } else {
            return cb(0);
        }
    });
}
