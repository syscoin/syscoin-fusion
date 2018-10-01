const firebase = require('firebase-functions')
const admin = require('firebase-admin')

module.exports = (uid, chargeAmount, cb) => {
    var currentBalance = 0;
    var readBalance = admin.database().ref('balance/' + uid);
    readBalance.on('value', (snapshot) => {
           collectionObj = snapshot.val();
            if (snapshot.val() != null) 
               currentBalance = snapshot.val();
            
    });

    try { 
        currentBalance = currentBalance + chargeAmount;
        let obj = {}
        obj[uid] =currentBalance.toString()

        admin.database().ref('/balance').set(obj, (error) => {
            if (error) {
                console.log(error)
            }
        })

        return cb(null)
    } catch (err) {
        console.log("err: ", err)
        return cb(err)
    } 
}
