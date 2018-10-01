const firebase = require('firebase-functions')
const admin = require('firebase-admin')

module.exports = (obj, cb) => {
    const { amount } =  obj
    
    var user = firebase.auth().currentUser;
  
    if (user !== null) {
        uid = user.uid;
    } 

    var currentBalance;
    var readBalance = firebase.database().ref('balance/' + uid);
    readBalance.on('value', (snapshot) => {
           currentBalance = snapshot.val();
    });

    try {
        currentBalance = currentBalance + amount;
        firebase.database().ref().update('balance/' + uid + '/' + currentBalance)
    } catch (err) {
        return cb(err)
    } 
}
