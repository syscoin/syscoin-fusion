const admin = require('firebase-admin')

module.exports = (uid, cb) => {
    var readBalance = admin.database().ref('balance/' + uid);

    readBalance.once('value', (snapshot) => {
           collectionObj = snapshot.val();
            if (collectionObj) {
                return cb(collectionObj); 
            }
            return cb(0);
    });
}
