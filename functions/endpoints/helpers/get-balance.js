const admin = require('firebase-admin')

module.exports = (uid, cb) => {
    var readBalance = admin.database().ref('balance/' + uid);
    try {
        readBalance.once('value', snapshot => {
            return cb(null, snapshot.val()); 
        });
    } catch (e) {
        console.log("Get balance error: ", e)
        return cb(null, 0);
    }
}
